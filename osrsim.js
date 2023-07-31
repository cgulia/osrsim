import { target } from './targets.mjs';
import { gear } from './gear.mjs';
import { calc } from './calc.js';
import { sim } from './sim.js';
const coutput = document.getElementById("coutput");
document.querySelector('#ibtn').addEventListener('click', processcmd);

const loadmessage = [
    '<span class="blue"><b>osrsim v1.4</b></span>',
    '<span class="yellow">&#9888; heavy operations may cause the client to freeze</span>',
    'use <b>help</b> for commands & information'
];
sendlines(loadmessage);

function processcmd() {
    const input = document.getElementById("uinput");
    sendlines(['<span class="light">' + input.value + '</span>']);
    const preargs = input.value.split(" ");
    let args = [];
    preargs.forEach(a => {
        args.push(a.split("@"));
    });
    cmd(args);
    input.value = "";
}

function cmd(args) {
    if (args[0] == 'targets') {
        let output = []
        Object.keys(target).forEach(t => {
            output.push('- ' + t);
        });
        sendlines(output);
    }

    if (args[0] == 'gear') {
        let output = [];
        Object.keys(gear).forEach(t => {
            output.push('- ' + t);
        });
        sendlines(output);
    }

    if (args[0] == 'calc') {
        let ftarget = false;
        let fgear = false;
        let starget = '';
        let sgear = '';
        args.forEach(a => {
            if (a[0] == 'target') {
                if (a[1] != null) {
                    starget = a[1];
                    ftarget = true;
                }
            }
            if (a[0] == 'gear') {
                if (a[1] != null) {
                    sgear = a[1];
                    fgear = true;
                }
            }
        });
        if (ftarget && fgear) {
            const calcres = calc(target[starget], gear[sgear], args);
            sendlines(calcres[0]);
        }
    }

    if (args[0] == 'sim') {
        let ftarget = false;
        let fgear = false;
        let starget = '';
        let sgear = '';
        let iterations = 100;
        let zcbspecs = 0;
        let vwrspecs = 0;
        let raidlvl = 0;
        let bgs = 0;
        args.forEach(a => {
            if (a[0] == 'target') {
                if (a[1] != null) {
                    starget = a[1];
                    ftarget = true;
                }
            }
            if (a[0] == 'gear') {
                if (a[1] != null) {
                    sgear = a[1];
                    fgear = true;
                }
            }
            if (a[0] == 'iterations') {
                if (a[1] != null) {
                    iterations = parseInt(a[1]);
                }
            }
            if (a[0] == 'raidlvl') {
                if (a[1] != null) {
                    raidlvl = parseInt(a[1]);
                }
            }
            if (a[0] == 'zcbs') {
                if (a[1] != null) {
                    zcbspecs = parseInt(a[1]);
                }
            }
            if (a[0] == 'vwrs') {
                if (a[1] != null) {
                    vwrspecs = parseInt(a[1]);
                }
            }
            if (a[0] == 'bgs') {
                if (a[1] != null) {
                    bgs = parseInt(a[1]);
                }
            }

        });
        if (ftarget && fgear) {
            //postoutput([command]);
            const simvars = calc(target[starget], gear[sgear], args);
            //console.log(simvars[1]);
            //export function sim(trg, wpn, maroll, max, aspd, its, rlvl, zcbs, vwrs) {
            const simres = sim(target[starget], gear[sgear], simvars[1].aroll, simvars[1].max, gear[sgear].aspd, iterations, raidlvl, zcbspecs, vwrspecs);
            sendlines(simres[0]);
            sendsim(simres[1]);
        }
    }
}

function sendlines(data) {
    data.forEach(d => {
        const newline = document.createElement('div');
        newline.class = 'nl';
        newline.innerHTML = d;
        coutput.appendChild(newline);
    });
}

function sendsim(data) {
    //format and embed chart
    const dpsvalues = data;
    console.log(dpsvalues);
    let dlabels = [];
    let dvalues = [];
    for (let d = 0; d < dpsvalues.length; d++) {
        dlabels.push(Math.floor(dpsvalues[d][0]));
        dvalues.push(dpsvalues[d][1]);
    }
    //console.log(dlabels);
    const newline = document.createElement('div');
    newline.class = 'nl';
    coutput.appendChild(newline);
    const ctx = document.createElement('canvas');
    newline.appendChild(ctx);
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dlabels,
            datasets: [{
                label: '',
                data: dvalues,
                borderWidth: 1
            },
            ]
        },
        options: {
            tension: 0,
            pointRadius:1,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    sendlines(['-----------------------------------------------------------------------']);
}
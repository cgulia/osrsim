export function sim(trg, wpn, maroll, max, aspd, its, rlvl, zcbs, vwrs) {
    const iterations = its;
    const raidlvl = rlvl;
    const zcbspecs = zcbs;
    const vwrspecs = vwrs;

    let out = [];

    let mdroll = 0;
    const drollmult = 1 + (0.4 * (raidlvl / 100));
    if (trg.toamult) {
        mdroll = Math.floor(((trg.bdef + 9) * (trg.rdef + 64) * drollmult));
    } else {
        mdroll = Math.floor((trg.bdef + 9) * (trg.rdef + 64));
    }

    console.log('\nrunning ' + iterations + ' iterations...');
    for (let it = 0; it < iterations; it ++) {
        var attacktime = 0;
        var chp = 0;
        if (trg.toamult) {
            chp = (trg.hp * drollmult);
        } else {
            chp = trg.hp;
        }

        //redundant spec checks
        if (zcbspecs > 0) {
            chp -= (zcbspecs * 110);
            attacktime += Math.floor(0.6 * 5);
        }

        if (vwrspecs > 0) {
            for (v = 0; v < vwrspecs; v++) {
                var vwhit = Math.floor(Math.random() * 75);
                chp -= vwhit;
                attacktime += Math.floor(0.6 * 4);
            }
        }

        while (chp > 0) {
            var cdmg = 0;


            if (wpn.ruby) {
                var rubyroll = Math.floor(Math.random() * 1000);
            } else {
                var rubyroll = 10000;
            }

            if (rubyroll < 66) {
                cdmg = (chp * 0.22);
                if (cdmg > 110) {
                    cdmg = 110;
                }
            } else {
                var caroll = Math.floor(Math.random() * maroll);
                var cdroll = Math.floor(Math.random() * mdroll);
                if (caroll > cdroll) {
                    cdmg = Math.floor(Math.random() * max);
                } else {
                    cdmg = 0;
                }
            }

            chp -= Math.floor(cdmg);
            if (it == 0) {
                attacktime += 0.6;
            } else {
                attacktime += (aspd * 0.6);
            }
        }
        out.push(attacktime);
    }

    out.sort(function(a, b){return a - b});
    let atotal = 0;
    for (let a = 0; a < out.length; a++) {
        atotal += out[a];
    }

    let data = []
    for (let l = 0; l < out.length; l++) {
        if (l == 0) {
            data.push([out[0], 1]);
        } else {
            if (data[data.length - 1][0] == out[l]) {
                data[data.length - 1][1] += 1;
            } else {
                data.push([out[l], 1]);
            }
        }
    }

    const simoutput = [
        ['<span class="blue"><b>' + wpn.info + '</span> | <span class="orange">' + trg.info + ' @ ' + raidlvl + '</b></span>'],
        ['Simulated TTK avg @ ' + its + ' iterations: ' + atotal / out.length]
    ]
    return [simoutput, data];
}



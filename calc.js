export function calc(trg, wpn, args) {
    const boost = 21;
    //ToA vars
    const raidlvl = 350;
    const drollmult = 1 + (0.4 * (raidlvl / 100));
    //effective strength
    const estr = Math.floor(((99 + boost) * 1.23) + 8);
    //max hit
    var max = 0;
    if (wpn.dragonbane && trg.type == 'draconic') {
        max = Math.floor(((0.5 + estr * ((wpn.str) + 64)) / 640) * wpn.dragonbonus[0]);
    } else {
        max = Math.floor(((0.5 + estr * ((wpn.str) + 64)) / 640) * wpn.setbonus[0]);
    }
    //effective ranged attack
    const eatk = Math.floor(((99 + boost) * 1.23) + 5);
    //attack roll
    var aroll = 0;
    if (wpn.dragonbane && trg.type == 'draconic') {
        aroll = Math.floor((eatk * (wpn.acc + 64)) * wpn.dragonbonus[1]);
    } else {
        aroll = Math.floor((eatk * (wpn.acc + 64)) * wpn.setbonus[1]);
    }
    //target defence roll
    var droll = 0;
    if (trg.toamult) {
        droll = Math.floor(((trg.bdef + 9) * (trg.rdef + 64) * drollmult));
    } else {
        droll = Math.floor((trg.bdef + 9) * (trg.rdef + 64));
    }

    const acc = 1 - ((droll + 2) / (2 * aroll + 1));
    const dph = (max * acc) / 2;
    const dps = dph / (0.6 * wpn.aspd);
    var chp = 0;
    if (trg.toamult) {
        chp = (trg.hp * drollmult);
    } else {
        chp = trg.hp;
    }
    const ettk = (chp / dps);
    const calcdata = {
        max:max,
        aroll:aroll,
    }
    const calcoutput = [
        ['<span class="blue"><b>' + wpn.info + '</span> | <span class="orange">' + trg.info + ' @ ' + raidlvl + '</b></span>'],
        //[' <b>#target stats</b>'],
        //['  BDEF:' + trg.bdef + ' RDEF:' + trg.rdef + ' HP:' + Math.floor(chp) + ' MDR:' + droll],
        //['  HP:   ' + Math.floor(chp)],
        //['  BDEF: ' + trg.bdef],
        //['  RDEF: ' + trg.rdef],
        //[' <b>#gear stats</b>'],
        [' MAX: ' + max],
        [' ACC: ' + Math.floor((acc * 100) * 1000) / 1000 + '%'],
        [' MAR: ' + aroll],
        [' MDR: ' + droll],
        [' DPH: ' + dph],
        [' DPS: ' + dps + '</span>'],
        [' <span class="green">TTK: ' + ettk + 's</span>'],
        //['  ETTK: ' + Math.floor(ettk * 10000) / 10000 + 's'],
        ['--------------------------------------------------']
    ]
    return [calcoutput, calcdata];
}
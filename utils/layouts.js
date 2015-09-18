var operation = 'layout';

var remotes = require('./converted.json');

Array.prototype.seperator = function(obj) {
    if (this.length > 0) {
        var temp = this.pop();
        this.push(temp);
        if (temp !== obj)
            this.push(obj);
    }
}

Array.prototype.pushUnique = function(obj) {
    var temp = null;
    if (this.length > 0) {
        temp = this.pop();
        this.push(temp);
    }
    if (temp !== obj)
        this.push(obj);
}

var filter = function(key) {
    if (key.match(/,/)) return '';

    return key
        .replace(/\'/g, '')
        .replace(/\"/g, '')
        .replace(/_+$/, '+')
        .replace(/_-$/, '-')
        .replace(/^NUM_*/, '')
        .replace(/^NUMBER_/, '')
        .replace(/^KEY_/, '')
        .replace(/^BTN_/, '')

        .replace(/^STANDBY[\/_-]*ON$/, 'POWER')
        .replace(/STAND_*BY$/, 'POWER')
        .replace(/^SYSTEM_STANDBY$/, 'POWER')

        .replace(/^VOL[UME]*[-_]*UP$/, 'VOL+')
        .replace(/^VOL[UME]*[-_]*D[OWN]+$/, 'VOL-')
        .replace(/^VOL[UME]*_*[\+\>]+$/, 'VOL+')
        .replace(/^VOL[UME]*_*[\-\<]+$/, 'VOL-')
        .replace(/^VOL[UME]*[-_]*INC$/, 'VOL+')
        .replace(/^VOL[UME]*[-_]*DEC$/, 'VOL-')
        .replace(/^VOL[UME]*[-_]*PLUS$/, 'VOL+')
        .replace(/^VOL[UME]*[-_]*MINUS$/, 'VOL-')
        .replace(/^VOL[UME]*[-_]*HIGHER$/, 'VOL+')
        .replace(/^VOL[UME]*[-_]*LOWER$/, 'VOL-')
        .replace(/^GENERALVOL[UME]*_*\+$/, 'VOL+')
        .replace(/^GENERALVOL[UME]*_*\-$/, 'VOL-')
        .replace(/^M\.*VOL[UME]*_*\+$/, 'VOL+')
        .replace(/^M\.*VOL[UME]*_*\-$/, 'VOL-')
        .replace(/^MAIN_*VOL[UME]*_*\+$/, 'VOL+')
        .replace(/^MAIN_*VOL[UME]*_*\-$/, 'VOL-')
        .replace(/^MAIN-VOL[UME]*_*UP$/, 'VOL+')
        .replace(/^MAIN-VO[UME]*L_*DOWN$/, 'VOL-')
        .replace(/^MASTER_*VOL[UME]*_*[\+\>]+$/, 'VOL+')
        .replace(/^MASTER_*VOL[UME]*_*[\-\<]+$/, 'VOL-')
        .replace(/^MASTER_*VOL[UME]*_*UP$/, 'VOL+')
        .replace(/^MASTER_*VOL[UME]*_*DOWN$/, 'VOL-')
        .replace(/^\+_*VOL[UME]*$/, 'VOL+')
        .replace(/^\-_*VOL[UME]*$/, 'VOL-')

        .replace(/^CH[ANEL]*[-_]*UP$/, 'CH+')
        .replace(/^CH[ANEL]*[-_]*D[OWN]+$/, 'CH-')
        .replace(/^CH[ANEL]*[-_]*NEXT$/, 'CH+')
        .replace(/^CH[ANEL]*[-_]*PREV$/, 'CH-')
        .replace(/^CH[ANEL]*[-_]*[\+\>P]+$/, 'CH+')
        .replace(/^CH[ANEL]*[-_]*[\-\<M]+$/, 'CH-')
        .replace(/^\+_*CH$/, 'VOL+')
        .replace(/^\-_*CH$/, 'VOL-')

        .replace(/^CHAP[TER]*[-_]*FWD$/, 'CHAP+')
        .replace(/^CHAP[TER]*[-_]*REV$/, 'CHAP-')
        .replace(/^CHAP[TER]*[-_]*FORWARD$/, 'CHAP+')
        .replace(/^CHAP[TER]*[-_]*BACK$/, 'CHAP-')
        .replace(/^CHAP[TER]*[-_]*NEXT$/, 'CHAP+')
        .replace(/^CHAP[TER]*[-_]*PREV$/, 'CHAP-')
        .replace(/^CHAP[TER]*[-_]*[\+\>P]+$/, 'CHAP+')
        .replace(/^CHAP[TER]*[-_]*[\-\<M]+$/, 'CHAP-')

        .replace(/^PROGRAM$/, 'PROG')
        .replace(/^VOLUMEMUTE$/, 'MUTE')
        .replace(/^FASTFORWARD$/, 'FORWARD')
}

var rowAny = function(k, keys) {
    var row = [];
    keys.forEach(function(key) {
        if (k.hasOwnProperty(key)) {
            row.push(key);
            delete(k[key]);
        }
    });
    return row;
}

if (operation === 'keycount') {
    var keys = {};

    remotes.forEach(function(remote) {
        remote.keys.forEach(function(key) {
            k = filter(key.key.toUpperCase());
            if (keys[k])
                keys[k]++;
            else
                keys[k] = 1;
        });
    });

    for (var k in keys) {
        if (!keys.hasOwnProperty(k))
            continue;
        console.log(keys[k], k);
    }
}

var patterns = [
    { replace: true, pattern: /_*\+$/, icon: 'add'},
    { replace: true, pattern: /_*\-$/, icon: 'remove'},
    { replace: true, pattern: /^\+_*/, icon: 'add'},
    { replace: true, pattern: /^\-_*$/, icon: 'remove'},
    { replace: true, pattern: /[-_]*UP$/, icon: 'keyboard_arrow_up'},
    { replace: true, pattern: /[-_]*D[OWN]+$/, icon: 'keyboard_arrow_down'},
    { replace: true, pattern: /[-_]*LEFT$/, icon: 'keyboard_arrow_left'},
    { replace: true, pattern: /[-_]*RIGHT$/, icon: 'keyboard_arrow_right'},
    { replace: true, pattern: /_*PLAY$/, icon: 'play_arrow' },
    { replace: true, pattern: /_*PAUSE$/, icon: 'pause' },
    { replace: true, pattern: /_*STOP$/, icon: 'stop' },
    { replace: true, pattern: /\/$/ },

    { pattern: 'POWER', icon: 'settings_power' },
    { pattern: 'MUTE', icon: 'volume_off' },
    { pattern: 'MENU', icon: 'menu' },
    { pattern: 'REWIND', icon: 'fast_rewind', name: 'REW' },
    { pattern: 'FORWARD', icon: 'fast_forward', name: 'FWD' },
    { pattern: 'PREVIOUS', icon: 'keyboard_arrow_left', name: 'PREV' },
    { pattern: 'NEXT', icon: 'keyboard_arrow_right' },
    { pattern: 'BACK', icon: 'arrow_back' },
    { pattern: 'OK', icon: 'check' },
    { pattern: 'ENTER', icon: 'check' },
    { pattern: 'SELECT', icon: 'check' },
    { pattern: 'EXIT', icon: 'close' },
    { pattern: 'CANCEL', icon: 'cancel' },

    { replace: true, pattern: 'RED', color: 'red' },
    { replace: true, pattern: 'GREEN', color: 'green' },
    { replace: true, pattern: 'YELLOW', color: 'yellow' },
    { replace: true, pattern: 'BLUE', color: 'blue' },
];

if (operation === 'layout') {
    remotes.forEach(function(remote) {
        var keys = {};

        remote.keys.forEach(function(key) {
            // Normalize key id
            var k = filter(key.key.toUpperCase());
            if (k !== '')
                keys[k] = 1;
            key.key = k;
            // Generate key caption, icon, color
            key.name = k;
            for (var i = 0; i < patterns.length; i++) {
                var p = patterns[i];
                if (k.match(p.pattern)) {
                    if (p.icon !== undefined) key.icon = p.icon;
                    if (p.bcolor !== undefined) key.bcolor = p.bcolor;
                    if (p.replace === true) key.name = key.name.replace(p.pattern, '');
                    if (p.name !== undefined) key.name = p.name;
                    // delete(key.spec); delete(key.code); delete(key.tcode); console.log(key);
                    break;
                }
            }
        });

        var totKeys = 0;
        for (var key in keys) {
            if (keys.hasOwnProperty(key)) {
                totKeys++;
            }
        }
        var buttons = [];
        var row;

        row = rowAny(keys, ['POWER']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['VOL-', 'MUTE', 'VOL+']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['CH-', 'CH+']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['UP']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['LEFT', 'OK', 'ENTER', 'SELECT', 'RIGHT']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['DOWN']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['BACK', 'CANCEL', 'MENU', 'SETUP', 'EXIT']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['EPG', 'INFO', 'DISPLAY', 'CLEAR']);
        if (row.length > 0)
            buttons.push(row);

        buttons.pushUnique('BREAK');

        row = rowAny(keys, ['1', '2', '3']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['4', '5', '6']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['7', '8', '9']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['0']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['FAVORITES', 'INPUT', 'LAST']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['RED', 'GREEN', 'YELLOW', 'BLUE']);
        if (row.length > 0)
            buttons.push(row);

        buttons.pushUnique('BREAK');

        row = rowAny(keys, ['RECORD', 'PLAY', 'PLAYPAUSE', 'PAUSE', 'STOP']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['REWIND', 'FASTFORWARD', 'PREVIOUS', 'NEXT']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['A-B', 'AB', 'RANDOM', 'SHUFFLE', 'PROGRAM']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['AUDIO', 'SUBTITLE', 'AV']);
        if (row.length > 0)
            buttons.push(row);

        row = rowAny(keys, ['TV/VIDEO', 'TV', 'DVD', 'VIDEO', 'AUX', 'TAPE']);
        if (row.length > 0)
            buttons.push(row);

        var remKeys = 0;
        for (var key in keys) {
            if (keys.hasOwnProperty(key)) {
                remKeys++;
            }
        }

        if (remKeys > 0) {
            buttons.pushUnique('BREAK');
            row = [];
            for (var key in keys) {
                if (keys.hasOwnProperty(key)) {
                    row.push(key);
                    if (row.length >= 3) {
                        buttons.push(row);
                        row = [];
                    }
                }
            }
            if (row.length > 0) {
                buttons.push(row);
                row = [];
            }
        }

        // console.log(buttons);

        var score = Math.floor((totKeys - remKeys) * 16 / totKeys);
        // console.log(remKeys, totKeys, score);

        var layout = [];
        buttons.forEach(function(row) {
            if (row === 'BREAK')
                layout.pushUnique('pagebreak');
            else {
                row.forEach(function(b) {
                    layout.push(b);
                });
                layout.pushUnique('rowbreak');
            }
        });
        layout.pushUnique('pagebreak');
        // console.log(layout);

        remote.confidence += score;
        remote.layout = layout;
        console.log(JSON.stringify(remote));
    });
}


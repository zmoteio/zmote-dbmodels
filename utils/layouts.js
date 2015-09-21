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

var filter = function(key) {
    if (key.match(/,/)) return key;

    return key
        .replace(/^\'(.+)\'$/g, '$1')
        .replace(/_\+$/, '+')
        .replace(/_\-$/, '-')
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
        .replace(/^MAIN-VOL[UME]*_*D[OWN]+$/, 'VOL-')
        .replace(/^MASTER_*VOL[UME]*_*[\+\>]+$/, 'VOL+')
        .replace(/^MASTER_*VOL[UME]*_*[\-\<]+$/, 'VOL-')
        .replace(/^MASTER_*VOL[UME]*_*UP$/, 'VOL+')
        .replace(/^MASTER_*VOL[UME]*_*D[OWN]+$/, 'VOL-')
        .replace(/^\+_*VOL[UME]*$/, 'VOL+')
        .replace(/^\-_*VOL[UME]*$/, 'VOL-')

        .replace(/^CH[ANEL]*[-_]*UP$/, 'CH+')
        .replace(/^CH[ANEL]*[-_]*D[OWN]+$/, 'CH-')
        .replace(/^CH[ANEL]*[-_]*NEXT$/, 'CH+')
        .replace(/^CH[ANEL]*[-_]*PREV$/, 'CH-')
        .replace(/^CH[ANEL]*[-_]*[\+\>]+$/, 'CH+')
        .replace(/^CH[ANEL]*[-_]*[\-\<]+$/, 'CH-')
        .replace(/^\+_*CH$/, 'CH+')
        .replace(/^\-_*CH$/, 'CH-')

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
            row.push(k[key]);
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
	{ pattern: /[0-9]+[\+\-]$/ },
	{ pattern: /[\+\-][0-9]+$/ },
	{ pattern: /BACK[-_]*UP/ },
	{ pattern: /SET[-_]*UP/ },
	{ pattern: /^A[-_]*B$/, name: 'A-B' },
	{ pattern: /^.*\+\/\-$/ },

	{ replace: true, pattern: /[-_]*\+$/, icon: 'add' },
	{ replace: true, pattern: /[-_]*\-$/, icon: 'remove' },
	{ replace: true, pattern: /^\+[-_]*/, icon: 'add' },
	{ replace: true, pattern: /^\-[-_]*/, icon: 'remove' },
	{ replace: true, pattern: /[-_]+UP$/, icon: 'keyboard_arrow_up' },
	{ replace: true, pattern: /[-_]+D[OWN]+$/, icon: 'keyboard_arrow_down' },
	{ replace: true, pattern: /[-_]+LEFT$/, icon: 'keyboard_arrow_left' },
	{ replace: true, pattern: /[-_]+RIGHT$/, icon: 'keyboard_arrow_right' },

    { pattern: /^POWER$/, icon: 'settings_power' },
	{ pattern: /^MUTE$/, icon: 'volume_off' },
	{ pattern: /^MENU$/, icon: 'menu' },
	{ pattern: /^PLAY$/, icon: 'play_arrow' },
	{ pattern: /^PAUSE$/, icon: 'pause' },
	{ pattern: /^STOP$/, icon: 'stop' },
	{ pattern: /^REWIND$/, icon: 'fast_rewind', name: 'REW' },
	{ pattern: /^FORWARD$/, icon: 'fast_forward', name: 'FWD' },
	{ pattern: /^PREVIOUS$/, icon: 'keyboard_arrow_left', name: 'PREV' },
	{ pattern: /^NEXT$/, icon: 'keyboard_arrow_right' },
	{ pattern: /^BACK$/, icon: 'arrow_back' },
	{ pattern: /^OK$/, icon: 'check' },
	{ pattern: /^ENTER$/, icon: 'check' },
	{ pattern: /^SELECT$/, icon: 'check' },
	{ pattern: /^EXIT$/, icon: 'close' },
	{ pattern: /^CANCEL$/, icon: 'cancel' },

    { replace: true, pattern: /^RED$/, bcolor: 'red' },
	{ replace: true, pattern: /^GREEN$/, bcolor: 'green' },
	{ replace: true, pattern: /^YELLOW$/, bcolor: 'yellow' },
	{ replace: true, pattern: /^BLUE$/, bcolor: 'blue' },
];

if (operation === 'layout') {
    // var names = {};
    remotes.forEach(function(remote) {
        var keys = {};

        remote.keys.forEach(function(key) {
            // Normalize key name
            var k = filter(key.key.toUpperCase());
            // Generate key caption, icon, color
            key.name = k;
            for (var i = 0; i < patterns.length; i++) {
                var p = patterns[i];
                if (k.match(p.pattern)) {
                    if (p.icon !== undefined) key.icon = p.icon;
                    if (p.bcolor !== undefined) key.bcolor = p.bcolor;
                    if (p.replace === true) key.name = key.name.replace(p.pattern, '');
                    if (p.name !== undefined) key.name = p.name;
                    break;
                }
            }
            // Reverse LUT for generating layout
            keys[key.name] = key.key;

            // if (!names[key.name])
            //     names[key.name] = [];
            // if (names[key.name].indexOf(key.key.toUpperCase()) < 0)
            //     names[key.name].push(key.key.toUpperCase());
            // delete(key.spec); delete(key.code); delete(key.tcode);
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

        buttons.seperator('BREAK');

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

        buttons.seperator('BREAK');

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
            buttons.seperator('BREAK');
            row = [];
            for (var key in keys) {
                if (keys.hasOwnProperty(key)) {
                    row.push(keys[key]);
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
                layout.seperator('pagebreak');
            else {
                row.forEach(function(b) {
                    layout.push(b);
                });
                layout.seperator('rowbreak');
            }
        });
        layout.seperator('pagebreak');
        // console.log(layout);

        remote.confidence += score;
        remote.layout = layout;
        console.log(JSON.stringify(remote));
    });
    // console.log(JSON.stringify(names));
}


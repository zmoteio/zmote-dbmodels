var fs = require('fs');
var remotes = require('./converted.json');

Array.prototype.seperator = function(obj) {
    if (this.length > 0) {
        var temp = this.pop();
        this.push(temp);
        if (temp !== obj)
            this.push(obj);
    }
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

var filter = function(key) {
    if (key.match(/,/)) return key;

    return key
        .replace(/^\'(.+)\'$/g, '$1')
        .replace(/_\+$/, '+')
        .replace(/_\-$/, '-')
        .replace(/^NUM_+/, '')
        .replace(/^NUMBER_+/, '')
        .replace(/^KEY_+/, '')
        .replace(/^BTN_+/, '')

        .replace(/^STAND[\-_]*BY$/, 'POWER')
        .replace(/^STAND[\-_]*BY[\/\-_]*ON$/, 'POWER')
        .replace(/^SYSTEM[\-_]*STAND[\-_]*BY$/, 'POWER')
        .replace(/^SYSTEM[\-_]*POWER$/, 'POWER')
        .replace(/^MASTER[\-_]*POWER$/, 'POWER')
        .replace(/^POWER[\-_]*ON[\/\-_]*OFF$/, 'POWER')
        .replace(/^([^\/\-_]+)[\/\-_]*POWER$/, '$1_POWER')

        .replace(/^VOL[UME]*[\-_]*UP$/, 'VOL+')
        .replace(/^VOL[UME]*[\-_]*D[OWN]+$/, 'VOL-')
        .replace(/^VOL[UME]*_*[\+\>]+$/, 'VOL+')
        .replace(/^VOL[UME]*_*[\-\<]+$/, 'VOL-')
        .replace(/^VOL[UME]*[\-_]*INC$/, 'VOL+')
        .replace(/^VOL[UME]*[\-_]*DEC$/, 'VOL-')
        .replace(/^VOL[UME]*[\-_]*PLUS$/, 'VOL+')
        .replace(/^VOL[UME]*[\-_]*MINUS$/, 'VOL-')
        .replace(/^VOL[UME]*[\-_]*HIGHER$/, 'VOL+')
        .replace(/^VOL[UME]*[\-_]*LOWER$/, 'VOL-')
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

        .replace(/^CH[ANEL]*[\-_]*UP$/, 'CH+')
        .replace(/^CH[ANEL]*[\-_]*D[OWN]+$/, 'CH-')
        .replace(/^CH[ANEL]*[\-_]*NEXT$/, 'CH+')
        .replace(/^CH[ANEL]*[\-_]*PREV$/, 'CH-')
        .replace(/^CH[ANEL]*[\-_]*[\+\>]+$/, 'CH+')
        .replace(/^CH[ANEL]*[\-_]*[\-\<]+$/, 'CH-')
        .replace(/^\+_*CH$/, 'CH+')
        .replace(/^\-_*CH$/, 'CH-')

        .replace(/^CHAP[TER]*[\-_]*FWD$/, 'CHAP+')
        .replace(/^CHAP[TER]*[\-_]*REV$/, 'CHAP-')
        .replace(/^CHAP[TER]*[\-_]*FORWARD$/, 'CHAP+')
        .replace(/^CHAP[TER]*[\-_]*BACK$/, 'CHAP-')
        .replace(/^CHAP[TER]*[\-_]*NEXT$/, 'CHAP+')
        .replace(/^CHAP[TER]*[\-_]*PREV$/, 'CHAP-')
        .replace(/^CHAP[TER]*[\-_]*[\+\>P]+$/, 'CHAP+')
        .replace(/^CHAP[TER]*[\-_]*[\-\<M]+$/, 'CHAP-')

        .replace(/^AMP[\.\-_]+/, 'AMP_')
        .replace(/^AUDIO[\.\-_]+/, 'AUDIO_')
        .replace(/^AUTO[\.\-_]+/, 'AUTO_')
        .replace(/^AUX[\.\-_]+/, 'AUX_')
        .replace(/^AV[\.\-_]+/, 'AV_')
        .replace(/^CD[\.\-_]+/, 'CD_')
        .replace(/^DECK[\.\-_]+/, 'DECK_')
        .replace(/^DISC[\.\-_]+/, 'DISC_')
        .replace(/^DISPLAY[\.\-_]+/, 'DISPLAY_')
        .replace(/^DSP[\.\-_]+/, 'DSP_')
        .replace(/^DVD[\.\-_]+/, 'DVD_')
        .replace(/^EQ[\.\-_]+/, 'EQ_')
        .replace(/^INDEX[\.\-_]+/, 'INDEX_')
        .replace(/^INPUT[\.\-_]+/, 'INPUT_')
        .replace(/^MD[\.\-_]+/, 'MD_')
        .replace(/^MULTI[\.\-_]+/, 'MULTI_')
        .replace(/^PAUSE[\.\-_]+/, 'PAUSE_')
        .replace(/^PIP[\.\-_]+/, 'PIP_')
        .replace(/^SAT[\.\-_]+/, 'SAT_')
        .replace(/^SEARCH[\.\-_]+/, 'SEARCH_')
        .replace(/^SELECT[\.\-_]+/, 'SELECT_')
        .replace(/^SKIP[\.\-_]+/, 'SKIP_')
        .replace(/^TAPE1[\.\-_]+/, 'TAPE1_')
        .replace(/^TAPE2[\.\-_]+/, 'TAPE2_')
        .replace(/^TAPE[\.\-_]+/, 'TAPE_')
        .replace(/^TUNER[\.\-_]+/, 'TUNER_')
        .replace(/^TV[\.\-_]+/, 'TV_')
        .replace(/^VCR[\.\-_]+/, 'VCR_')
        .replace(/^VTR[\.\-_]+/, 'VTR_')

        .replace(/^PROGRAM$/, 'PROG')
        .replace(/^VOLUMEMUTE$/, 'MUTE')
        .replace(/^FASTFORWARD$/, 'FORWARD')
        .replace(/^A[\.\/\-_]*B[_RPT]*$/, 'A-B')
}

var patterns = [
	{ pattern: /[0-9]+[\+\-]$/ },
	{ pattern: /[\+\-][0-9]+$/ },
	{ pattern: /BACK[-_]*UP/ },
	{ pattern: /SET[-_]*UP/ },
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

    { replace: true, pattern: /^RED$/, color: 'red' },
	{ replace: true, pattern: /^GREEN$/, color: 'green' },
	{ replace: true, pattern: /^YELLOW$/, color: 'yellow' },
	{ replace: true, pattern: /^BLUE$/, color: 'blue' },
];

var names = {};
var protocols = {};
var remotes_out = [];

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
                if (p.color !== undefined) key.color = p.color;
                if (p.replace === true) key.name = key.name.replace(p.pattern, '');
                if (p.name !== undefined) key.name = p.name;
                break;
            }
        }
        // Reverse LUT for generating layout
        keys[key.name] = key.key;

        // For debugging name normalization
        if (!names[key.name])
            names[key.name] = [];
        if (names[key.name].indexOf(key.key.toUpperCase()) < 0)
            names[key.name].push(key.key.toUpperCase());

        // For look-up using protocol -> device -> subdevice
        if (key.spec && key.spec.protocol != 'none') {
            if (!protocols.hasOwnProperty(key.spec.protocol))
                protocols[key.spec.protocol] = {};
            if (!protocols[key.spec.protocol].hasOwnProperty(key.spec.device))
                protocols[key.spec.protocol][key.spec.device] = {};
            if (!protocols[key.spec.protocol][key.spec.device].hasOwnProperty(key.spec.subdevice))
                protocols[key.spec.protocol][key.spec.device][key.spec.subdevice] = [];
            if (protocols[key.spec.protocol][key.spec.device][key.spec.subdevice].indexOf(remote.brand + ' ' + remote.model) < 0)
                protocols[key.spec.protocol][key.spec.device][key.spec.subdevice].push(remote.brand + ' ' + remote.model);
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
        var rowCount = 0;
        row = [];
        for (var key in keys) {
            if (keys.hasOwnProperty(key)) {
                row.push(keys[key]);
                if (row.length >= 3) {
                    buttons.push(row);
                    rowCount++;
                    if (rowCount >= 5) {
                        buttons.seperator('BREAK');
                        rowCount = 0;
                    }
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
    remotes_out.push(remote);
});

fs.writeFileSync('names.json', JSON.stringify(names));
fs.writeFileSync('protocols.json', JSON.stringify(protocols));
fs.writeFileSync('remotes.json', JSON.stringify(remotes_out));

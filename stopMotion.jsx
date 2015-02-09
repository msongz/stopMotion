//quickStopMotion 
//version 4.0
//2015 01.03 18:16
//copyright (c) songz meng test again


sM_Data = new Object();

sM_Data.scriptName = {
    en: "quickStopMotion",
    cn: "快速定格"
};

sM_Data.inPuText = {
    en: "input time(second)",
    cn: "输入时长(秒)"
};
sM_Data.exeCute = {
    en: "execute",
    cn: "执行"
};
sM_Data.noComp = {
    en: "Please select a single composition in the Project panel, and try again.",
    cn: "在项目面板选中或打开一个合成"
};
sM_Data.noLayer = {
    en: "Please select a layer, and try again.",
    cn: "请选中一个图层"
};
sM_Data.noText = {
    en: "No text was input,try input numbers",
    cn: "请输入数字再执行"
};
sM_Data.error = {
    en: "error",
    cn: "错误"
};
sM_Data.lastFrame = {
    en: "manual precomp will be better at current time",
    cn: "当前位置手动预合成更佳"
};
sM_Data.about = {
    en: "thank you for using quicktext ae script. \n " + "\n" + "contact me: weibo.com/songz",
    cn: "谢谢使用\n" + "\n" + "联系我 weibo.com/songz"
};

win = new Window('palette', sM_localize(sM_Data.scriptName));

wP = win.add("panel", [0, 0, 225, 100], sM_localize(sM_Data.inPuText));

wP.eT = wP.add("edittext", [15, 15, 150, 35]);

wP.eC = wP.add("button", [15, 45, 205, 75], sM_localize(sM_Data.exeCute));

wP.qU = wP.add("button", [180, 15, 205, 35], '?');

win.show();

function sM_validNum() {

    var enteredValue = this.text;

    if (isNaN(enteredValue) || (enteredValue <= 0)) {

        this.text = "1";
    };
};

function sM_localize(Var) {

    if (app.isoLanguage === "zh_CN") {

        return Var["cn"];

    } else {

        return Var["en"];

    }
};

wP.eT.onChange = sM_validNum;

wP.qU.onClick = function() {

    alert(sM_localize(sM_Data.about), sM_localize(sM_Data.scriptName))

};

wP.eC.onClick = function() {

    app.beginUndoGroup(sM_localize(sM_Data.scriptName));

    aI = app.project.activeItem;

    if (!(aI instanceof CompItem)) {

        alert(sM_localize(sM_Data.noComp), sM_localize(sM_Data.error));

        return;
    }
    if (aI.selectedLayers.length == 0) {

        alert(sM_localize(sM_Data.noLayer), sM_localize(sM_Data.error));

        return;
    }
    if (wP.eT.text == "") {

        alert(sM_localize(sM_Data.noText), sM_localize(sM_Data.error));

        return;
    }
    
    sL = aI.selectedLayers;
    
    if (aI.time == sL[0].outPoint-1/aI.frameRate ) {

        alert(sM_localize(sM_Data.lastFrame), sM_localize(sM_Data.error));
        
        return;
    }
    
    sLAr = new Array();

    sLAr[0] = sL[0].index;

    iP = sL[0].inPoint;

    aI.layers.precompose(sLAr, sL[0].name, true);

    sL = aI.selectedLayers;

    sL[0].source.displayStartTime = sL[0].source.layer(1).inPoint;

    sL[0].source.layer(1).startTime -= sL[0].source.layer(1).inPoint;

    sL[0].source.duration = sL[0].source.layer(1).outPoint - sL[0].source.layer(1).inPoint;

    sL[0].startTime = iP;

    if ((sL[0].outPoint + parseFloat(wP.eT.text)) > aI.duration) {

        aI.duration = sL[0].outPoint + parseFloat(wP.eT.text);
    };

    sL[0].timeRemapEnabled = true;

    sL[0].timeRemap.setValueAtTime(sL[0].time, sL[0].timeRemap.value);

    var i;

    if (sL[0].timeRemap.numKeys == 3) {

        i = 3;

    } else {

        i = 2;
    }

    oPkeyTime = sL[0].timeRemap.keyTime(i);

    sL[0].timeRemap.setValueAtTime(oPkeyTime + parseFloat(wP.eT.text), sL[0].timeRemap.keyValue(i));

    sL[0].timeRemap.removeKey(i);

    sL[0].timeRemap.setValueAtTime(aI.time + parseFloat(wP.eT.text), sL[0].timeRemap.value);
    
    sL[0].outPoint = sL[0].timeRemap.keyTime(sL[0].timeRemap.numKeys);

    app.endUndoGroup();
};


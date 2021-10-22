window.onload = function () {
  console.log("options.js - loaded")
  function saveChanges(option, value) {
    console.log("options.js - Why saved called")
    console.log("options.js - option", option)
    console.log("options.js - value", value)
    chrome.storage.local.set({
      [option]: value,
    });
  }

  // const pipCheckbox = document.querySelector("#pip");
  const popoutLegend = document.querySelector("#pip-field");
  const pipLegend = document.querySelector("label[for=pip]");
  const newTabLegend = document.querySelector("label[for=newTab]");
  const disableLegend = document.querySelector("label[for=disable]");

  const incrementsLegend = document.querySelector("#fb");
  const leftInputLabel = document.querySelector("label[for=left]");
  const middleInputLabel = document.querySelector("label[for=middle]");
  const rightInputLabel = document.querySelector("label[for=right]");
  const volumeRateInputLabel = document.querySelector("label[for=volumeRate]");
  const modeLegend = document.querySelector("#mode");
  

  // document.querySelector("#mode_seek_middle").textContent = chrome.i18n.getMessage("vonly");
  // document.querySelector("#mode_volume").textContent = chrome.i18n.getMessage("ponly");
  // document.querySelector("#mode_seek_all").textContent = chrome.i18n.getMessage("mode_seek_all");
  // document.querySelector("#mode_everything").textContent = chrome.i18n.getMessage("both");

  // document.querySelector("#mode_seek_middle").textContent = chrome.i18n.getMessage("vonly");
  // document.querySelector("#mode_volume").textContent = chrome.i18n.getMessage("mode_volume");
  // document.querySelector("#mode_seek_all").textContent = chrome.i18n.getMessage("mode_seek_all");
  // document.querySelector("#mode_everything").textContent = chrome.i18n.getMessage("mode_everything");

  

  modeLegend.textContent = chrome.i18n.getMessage("mode_title");
  popoutLegend.textContent = chrome.i18n.getMessage("pop_out_video");
  pipLegend.textContent = chrome.i18n.getMessage("pip");
  // pipLegend.textContent = "hello";
  newTabLegend.textContent = chrome.i18n.getMessage("newTab");
  // newTabLegend.textContent = "a b c d";
  disableLegend.textContent = chrome.i18n.getMessage("disable");

  incrementsLegend.textContent = chrome.i18n.getMessage("fb_title");
  leftInputLabel.textContent = chrome.i18n.getMessage("left");
  middleInputLabel.textContent = chrome.i18n.getMessage("middle");
  rightInputLabel.textContent = chrome.i18n.getMessage("right");
  volumeRateInputLabel.textContent = chrome.i18n.getMessage("volumeRate");

  // no longer needed??? no longer have checkboxes
  for (const input of document.querySelectorAll("input")) {
    input.addEventListener("blur", (e) => {
      // let value = e.target.value;
      let value = e.target.type == "saveChanges" ? e.target.checked : e.target.value;
      // if (e.target.type == "checkbox") value = e.target.checked;
      saveChanges(e.target.name, value);
    });
  }

  chrome.storage.local.get(function (options) {
    console.log("options.js - Got something in options sotrage")
    console.log(options)
    if (options.mode === undefined) options.mode = "mode_everything";
    // if (options.pip === undefined) options.pip = false; // does nothing?
    // if (options.newTab === undefined) options.newTab = false; // does nothing ?
    if (options.popoutSetting === undefined) options.popoutSetting = "disable";

    document.querySelector("[name='left'").value = options.left || 5;
    document.querySelector("[name='middle'").value = options.middle || 2;
    document.querySelector("[name='right'").value = options.right || 10;
    document.querySelector("[name='volumeRate'").value = options.volumeRate || 6;

    document.querySelector("#" + options.popoutSetting).checked = true;
    document.querySelector("#" + options.mode).checked = true;

  });
};

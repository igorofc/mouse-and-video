let run = true;
let previousTabIndex;
let popups = {};

browser.tabs.onActivated.addListener((info) => {
  browser.windows.get(info.windowId).then((window) => {
    if (window.type !== "popup") {
      browser.tabs.get(info.previousTabId).then((tab) => {
        previousTabIndex = tab.index;
      });
    }
  });
});

chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.showIcon) {
    chrome.pageAction.show(sender.tab.id);
  } else if (message.popup) {
    if (message.acao === "criar") {
      browser.tabs.highlight({
        windowId: sender.tab.windowId,
        tabs: [previousTabIndex],
      });
      browser.windows
        .create({
          width: 370,
          height: 230,
          type: "popup",
          tabId: sender.tab.id,
        })
        .then((info) => {
          popups[info.id] = {
            tabIndex: sender.tab.index,
            windowId: sender.tab.windowId,
            popupTabId: info.tabs[0].id,
          };
          browser.windows.update(info.id, {
            left: screen.width - 390,
            top: screen.height - 255,
          });
        });
    } else if (message.acao === "fechar") {
      browser.windows.getCurrent().then((winInfo) => {
        // Move back to main window
        browser.tabs
          .move(popups[winInfo.id].popupTabId, {
            windowId: popups[winInfo.id].windowId,
            index: popups[winInfo.id].tabIndex,
          })
          .then((info) => {
            if (message.activatePopupTab) {
              browser.tabs.highlight({
                windowId: popups[winInfo.id].windowId,
                tabs: [info[0].index],
              });
            }
          });
      });
    }
  }

  // Aqui vamos verificar se a extensão deve ser desativada neste site.
  // Se o usuário desativou então o domain fica guardado.
  const domain = sender.tab.url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
  )[0];
  chrome.storage.local.get(domain, function (info) {
    // Se não tiver nada então não desativou
    if (Object.keys(info).length === 0) {
      chrome.tabs.sendMessage(sender.tab.id, {
        run: true,
      });
    } else {
      setIcon("disabled", sender.tab.id);
    }
  });
});

chrome.pageAction.onClicked.addListener(function (tab) {
  const domain = tab.url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
  )[0];
  chrome.storage.local.get(domain, function (info) {
    if (Object.keys(info).length > 0) {
      chrome.storage.local.remove(domain);
      chrome.tabs.sendMessage(tab.id, {
        run: true,
      });
      setIcon("enabled", tab.id);
    } else {
      // Usuário desativou a extensão, então manda uma mensagem para apagar o listener.
      chrome.tabs.sendMessage(tab.id, {
        disabled: true,
      });
      chrome.storage.local.set({
        [domain]: domain,
      });
      setIcon("disabled", tab.id);
    }
  });
});

function setIcon(status, id) {
  chrome.pageAction.setIcon({
    tabId: id,
    path: {
      16: "icons/" + status + "-16.png",
      32: "icons/" + status + "-32.png",
    },
  });

  chrome.pageAction.setTitle({
    tabId: id,
    title: chrome.i18n.getMessage(status),
  });
}

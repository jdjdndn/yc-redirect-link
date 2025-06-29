// ==UserScript==
// @name         替换真实链接(yc-redirect-links)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  尝试替换页面上的重定向链接为真实链接
// @author       wcbblll
// @match        *://*/*
// @exclude       *://www.google.com/*
// @grant        none
// @run-at            document-end
// ==/UserScript==

(function () {
  'use strict';

  function loopFunc(fn) {
    function callback(mutationsList, observer) {
      if (lastExecutionTime + delay < Date.now()) {
        fn(mutationsList, observer)
        lastExecutionTime = Date.now();
      }
    }

    let observer = new MutationObserver(callback);

    let delay = 500; // 间隔时间，单位毫秒
    let lastExecutionTime = 0;

    observer.observe(document.body, { childList: true, attributes: true, subtree: true });
  }

  // 自定义属性，用于判断链接是否经过修改
  const ycAttr = 'yc-changed'
  loopFunc(() => {
    // 获取页面上的所有<a>标签
    const links = document.querySelectorAll(`a[href]:not([${ycAttr}])`);
    // 遍历链接
    links.forEach(link => {
      link.setAttribute(ycAttr, 'true')
      if (!link || !link.host) return
      const linkUrl = decodeURIComponent(link.search)
      const sliceIndex = linkUrl.indexOf('//')
      if (sliceIndex < 0) return
      const targetUrl = linkUrl.slice(sliceIndex)
      link.setAttribute('originUrl', decodeURIComponent(link.href))
      link.href = targetUrl
      link.ref = "nofollow noopener noreferrer"
      link.rel = "noopener noreferrer"
    });
  })
})();

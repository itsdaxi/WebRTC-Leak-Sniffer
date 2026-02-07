// ==UserScript==
// @name         WebRTC Leak Sniffer v2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Advanced WebRTC monitoring tool that intercepts STUN/TURN requests to detect real IPs, bypasses tracking scripts, and provides real-time geolocation with a persistent, draggable UI.
// @author       Daxi
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = "your-api-key-here";
    let capturedIPs = new Set();
    let counter = 0;

    // Creates the panel if it doesn't exist
    function createPanel() {
        if (document.getElementById('geo-stealth-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'geo-stealth-panel';
        // Forced styling with !important to prevent the site from hiding it
        panel.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            background: rgba(10, 10, 10, 0.95) !important;
            color: #00ff41 !important;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            border: 1px solid #00ff41;
            box-shadow: 0 0 15px rgba(0,255,65,0.6);
            width: 260px;
            cursor: move;
            user-select: none;
            display: block !important;
        `;

        panel.innerHTML = `
            <div id="geo-header" style="padding: 10px; background: rgba(0, 255, 65, 0.15); border-bottom: 1px solid #00ff41; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 11px;">📡 TRACKER STATUS: ON</span>
                <button id="reset-geo-btn" style="background: #e74c3c; color: white; border: none; padding: 3px 10px; cursor: pointer; font-size: 10px; border-radius: 4px; font-weight: bold;">RESET</button>
            </div>
            <div id="geo-content" style="padding: 15px; font-size: 13px; line-height: 1.6;">
                <div style="color: #f1c40f; text-align:center;">WAITING FOR DATA...</div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('reset-geo-btn').onclick = (e) => { e.stopPropagation(); resetTracker(); };
        makeDraggable(panel);
    }

    function resetTracker() {
        capturedIPs.clear();
        counter = 0;
        const content = document.querySelector('#geo-content');
        if (content) content.innerHTML = '<div style="color: #f1c40f; text-align:center;">RESET COMPLETE...</div>';
    }

    // WebRTC Interception
    const RealRTC = window.RTCPeerConnection;
    const origAddIce = RealRTC.prototype.addIceCandidate;

    RealRTC.prototype.addIceCandidate = function(iceCandidate, ...args) {
        if (iceCandidate && iceCandidate.candidate && iceCandidate.candidate.includes("srflx")) {
            const ip = iceCandidate.candidate.split(" ")[4];
            if (ip && ip.includes(".") && !capturedIPs.has(ip)) {
                if (counter >= 1) capturedIPs.clear(); // Reset previous IP
                capturedIPs.add(ip);
                counter = 1;
                fetchGeo(ip);
            }
        }
        return origAddIce.apply(this, [iceCandidate, ...args]);
    };

    function fetchGeo(ip) {
        createPanel(); // Ensures the panel exists before showing data
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    updateOverlay(data);
                } catch(e) { console.error("API Error"); }
            }
        });
    }

    function updateOverlay(data) {
        createPanel();
        const content = document.querySelector('#geo-content');
        if (!content) return;

        const flag = (data.country_flag && data.country_flag !== "undefined")
            ? `<img src="${data.country_flag}" width="20" style="vertical-align: middle; margin-left: 8px;">`
            : '';

        content.innerHTML = `
            <strong style="color: #fff;">IP:</strong> <span style="color: #00ff41;">${data.ip}</span><br>
            <strong style="color: #fff;">COUNTRY:</strong> ${data.country_name}${flag}<br>
            <strong style="color: #fff;">CITY:</strong> ${data.city}<br>
            <strong style="color: #fff;">ISP:</strong> <span style="font-size: 11px; color: #aaa;">${data.isp}</span>
            <div style="margin-top: 10px; border-top: 1px solid #333; padding-top: 5px; font-size: 10px; color: #666; text-align: center;">
                ${data.latitude}, ${data.longitude}
            </div>
        `;
    }

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = el.querySelector('#geo-header');
        header.onmousedown = (e) => {
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (e) => {
                pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
                pos3 = e.clientX; pos4 = e.clientY;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
            };
        };
    }

    // Force creation on page load
    window.addEventListener('load', createPanel);
    // Shortcut R to reset
    window.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'r') resetTracker(); });


})();

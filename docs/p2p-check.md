---
section: legacy
hide:
  - next
  - prev
  - search
  - tabs

api:
  external_get_ip: https://whatismyipaddress.com
  get_ip: https://api.smash64.online/kaillera/get-ip
  p2p_check: https://api.smash64.online/kaillera/p2p-check
modals:
  failure: P2P is Not Responding
  more_info: How this Works
  success: P2P is Responding
---

# Kaillera P2P Checker

<style>
  .md-input-field {
    align-items: center;
    background-color: var(--md-code-bg-color);
    border-radius: .1rem;
    border: 0 solid;
    box-shadow: var(--md-shadow-z1);
    color: var(--md-default-fg-color);
    display: flex;
    padding: .6rem;
    width: 100%;
  }

  .md-input-field .prefix {
    border: 0 solid;
    flex-shrink: 0;
    font-weight: lighter;
    font-size: .6rem;
    padding-right: .6rem;
  }

  .md-input-field input {
    background-color: var(--md-code-bg-color);
    border: 0 solid;
    color: var(--md-default-fg-color);
    flex-grow: 1;
  }

  .md-input-field .suffix {
    border: 0 solid;
    flex-shrink: 0;
    font-weight: lighter;
    font-size: .6rem;
    padding-left: .6rem;
  }
</style>

{{ beta("feature") }}

!!! attention "Not for Lag"
    The feature cannot help you troubleshoot lag when playing online, only connection issues.

!!! attention "Autopunch P2P"
    This feature **does not** currently support Autopunch P2P, only port forwarding (manual or UPnP).

<p markdown="1">
<div markdown="1">
  <div class="md-input-field" markdown="1">
    <span class="prefix">IPv4 Address</span>
    <input type="text" id="p2p-ipv4">
    <span class="suffix" id="refresh-ip-button" style="display: none;">[:fontawesome-solid-arrows-rotate:](javascript:getIPv4())</span>
    <span class="suffix" id="get-ip-button" style="display: none;">[Get IP]({{ page.meta.api.external_get_ip }}){ target='_blank' }</span>
  </div>
<p></p>
  <div class="md-input-field">
    <span class="prefix">Port Number</span>
    <input type="number" id="p2p-port" min="1025" max="65535" value="27886" placeholder="27886">
  </div>
</div>
</p>

[Check P2P :fontawesome-solid-spinner:{ .fa-spin style="display: none;" }](javascript:checkP2P();){ .md-button .md-button--primary #check-p2p }
[More Info](#){ .md-button data-micromodal-trigger="{{ modalId(page.meta.modals.more_info) }}" #more-info }

{{ modalOk(page.meta.modals.failure, color="red", body="
The machine at `0.0.0.0:27886`{ #p2p_address } did not respond from Northern Virginia.

Make sure you confirm the following:

- Start hosting **before** you run this checker
- The P2P `Host Port` field is `27886`{ #p2p_port }
- Your router is forwarding **UDP** port `27886`{ #p2p_port }
- The correct **local IP** is being forwarded
- *Windows Firewall* allows traffic to the EXE
- Join the [Discord](https://discord.gg/ssb64) for more help
") }}

{{ modalOk(page.meta.modals.more_info, body="
Smash64 Online performs tries to connect to your game via P2P from Amazon's `us-east-1`
in Northern Virginia. This is the same as asking another player to try to connect to you.

This proves that your game is publicly accessible to the rest of the internet and that you
are currently hosting a game.
") }}

{{ modalOk(page.meta.modals.success, color="green", body="
The machine at `0.0.0.0:27886`{ #p2p_address } responded from Northern Virginia.
Remember to only share your IP with people you trust.

If your opponent can't connect, try the following:

- Start hosting **before** they try to connect
- Check their `Peer IP` is `0.0.0.0:27888`{ #p2p_address }
- Restart both emulators and try again
- Join the [Discord](https://discord.gg/ssb64) for more help
", buttons=[button("Copy Address", href='#', attributes=["data-clipboard-target='#" + modalId(page.meta.modals.success) + " #p2p_address'"])] ) }}

<script>
  function checkP2P() {
    var button = document.querySelector('#check-p2p span');
    button.style.display = 'inherit';

    var ipv4 = document.getElementById('p2p-ipv4');
    var port = document.getElementById('p2p-port');

    if (isIPv4(ipv4.value) && isValidPort(port.value)) {
      sessionStorage.setItem('p2p-ipv4', ipv4.value);

      fetch('{{ page.meta.api.p2p_check }}', {
        method: 'POST',
        body: JSON.stringify({
          host: ipv4.value || 'self',
          port: port.value || '27886',
          via: '{{ page.canonical_url }}',
        })
      })
      .then(response => response.json())
      .then(data => {
        button.style.display = 'none';
        showResults(port, data);
      })
      .catch(error => console.log(error));
    } else {
      button.style.display = 'none';
      alert$.next("Invalid IP address and/or port.");
    }
  }

  function getIPv4() {
    const ipv4 = document.getElementById('p2p-ipv4');
    let cached_ip = sessionStorage.getItem('p2p-ipv4');

    if (isIPv4(cached_ip)) {
      showIpButtons('refresh');
      ipv4.value = cached_ip;
    } else {
      fetch('{{ page.meta.api.get_ip }}', {
        method: 'GET',
      })
      .then(response => response.text())
      .then(data => {
        if (isIPv4(data)) {
          showIpButtons('refresh');
          ipv4.value = data;
          sessionStorage.setItem('p2p-ipv4', data);
        } else {
          showIpButtons('get');
        }
      })
      .catch(error => console.log(error));
    }
  }

  function isIPv4(data) {
    return data !== null && data.match(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/);
  }

  function isValidPort(data) {
    return Number(data) > 1024 && Number(data) < 65535;
  }

  function showIpButtons(which) {
    const get_button = document.getElementById('get-ip-button');
    const refresh_button = document.getElementById('refresh-ip-button');

    if (which == 'refresh') {
      get_button.style.display = 'none';
      refresh_button.style.display = 'inherit';
    } else {
      get_button.style.display = 'inherit';
      refresh_button.style.display = 'none';
    }
  }

  function showResults(port, results) {
    if (results.success) {
      modalId = '{{ modalId(page.meta.modals.success) }}';
    } else {
      modalId = '{{ modalId(page.meta.modals.failure) }}';
    }

    const meta = JSON.parse(results.meta);
    const address = `${meta.host}:${meta.port}`;
    const modal = document.getElementById(modalId);

    modal.querySelectorAll('#p2p_address').forEach((element) => {
      element.innerHTML = address;
    });
    modal.querySelectorAll('#p2p_port').forEach((element) => {
      element.innerHTML = port.value || '27886';
    });

    MicroModal.show(modalId);
    document.querySelector('.md-dialog').style.zIndex = 101;
    modal.querySelector('.md-button--primary').focus();
    modal.querySelector('.md-button--primary').blur();
  }

  getIPv4();
</script>

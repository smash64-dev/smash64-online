---
section: legacy
hide:
  - next
  - prev
  - search
  - tabs

api:
  p2p_check: https://api.smash64.online/kaillera/p2p-check
modals:
  failure: P2P is Not Responding
  more_info: How this Works
  success: P2P is Responding
---

# Kaillera P2P Checker

<style>
  .md-port-select {
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

  .md-port-select .prefix {
    border: 0 solid;
    font-weight: lighter;
    padding-right: .6rem;
  }

  .md-port-select input {
    background-color: var(--md-code-bg-color);
    border-radius: .1rem;
    border: 0 solid;
    color: var(--md-default-fg-color);
    flex-grow: 1;
  }
</style>

{{ beta("feature") }}

!!! attention "Not for Lag"
    The feature cannot help you troubleshoot lag when playing online, only connection issues.

!!! attention "Autopunch P2P"
    This feature **does not** currently support Autopunch P2P, only port forwarding (manual or UPnP).

<div class="md-port-select">
<span class="prefix">Port Number</span>
<input type="number" id="p2p-port" min="1025" max="65535" value="27886" placeholder="27886">
</div>

[Check P2P :fontawesome-solid-spinner:{ .fa-spin style="display: none;" }](javascript:checkP2P();){ .md-button .md-button--primary #check-p2p }
[More Info](#){ .md-button data-micromodal-trigger="{{ modalId(page.meta.modals.more_info) }}" #more-info }

{{ modalOk(page.meta.modals.failure, color="red", body="
The machine at `0.0.0.0:27886`{ #p2p_address } game did not respond from Northern Virginia.

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
The machine at `0.0.0.0:27886`{ #p2p_address } game responded from Northern Virginia.
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

    var port = document.getElementById('p2p-port');

    fetch('{{ page.meta.api.p2p_check }}', {
      method: 'POST',
      body: JSON.stringify({
        host: 'self',
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
</script>

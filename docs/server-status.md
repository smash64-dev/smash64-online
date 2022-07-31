---
section: legacy
hide:
  - next
  - prev
  - search
  - tabs

api:
  server_check: https://api.smash64.online/kaillera/server-check
modals:
  failure: Server is Not Responding
  more_info: How this Works
  success: Server is Responding
---

{%- set defaults = config.extra.servers.defaults %}
{%- macro render(server, region, defaults) %}
{%-   set visible = server.visible | default(defaults.visible) %}
<option {{ '' if visible else 'hidden' }}
 data-host="{{ server.host }}"
 data-port="{{ server.port | default(defaults.port) }}"
 data-location="{{ server.location | default(defaults.location) }}"
 data-owner="{{ server.owner | default(defaults.owner) }}"
 data-member="{{ server.member | default(defaults.member) | lower }}"
>{{ server.name }}</option>
{%- endmacro %}

# Kaillera Server Status

{{ beta("feature") }}

!!! attention "Not for Lag"
    The feature cannot help you troubleshoot lag when playing online, only connection issues.

<div markdown="0">
<select class="md-dropdown" id="server-list">
<option value="" disabled selected hidden>Select a server</option>
{%- for region, servers in config.extra.servers.list.items() %}
<optgroup label="{{ config.extra.servers.regions[region] }}">
{%-   for server in servers %}
{{     render(server, region, defaults) | replace("\n", "") }}
{%-   endfor %}
</optgroup>
{%- endfor %}
</select>
</div>

[Check Server :fontawesome-solid-spinner:{ .fa-spin style="display: none;" }](javascript:checkServer();){ .md-button .md-button--primary #check-server }
[More Info](#){ .md-button data-micromodal-trigger="{{ modalId(page.meta.modals.more_info) }}" #more-info }

{{ modalOk(page.meta.modals.failure, color="red", body="
<span id='server_name'>The server</span> did not respond from Northern Virginia.

Here's what we know:

- We used the address: `0.0.0.0:27888`{ #server_address }
- The check returned: `Unknown`{ #response }
- The server is <span id='server_owner'>not owned by a Smash64 player</span>
- Join the [Discord](https://discord.gg/ssb64) for more help
") }}

{{ modalOk(page.meta.modals.more_info, body="
Smash64 Online performs multiple Kaillera server PING checks (not the same as a regular ping), from Amazon's
`us-east-1` in Northern Virginia. This is the same check that happens in the Master Server List.

This proves that the server is accessible and the kaillera software is running.
") }}

{{ modalOk(page.meta.modals.success, color="green", body="
<span id='server_name'>The server</span> took `0ms`{ #response } to respond from Northern Virginia.

If it's not working for you, try the following:

- Check your address: `0.0.0.0:27888`{ #server_address }
- Wait 15 minutes if you tried multiple times in 5 minutes
- Join the [Discord](https://discord.gg/ssb64) for more help
", buttons=[button("Copy Address", href='#', attributes=["data-clipboard-target='#" + modalId(page.meta.modals.success) + " #server_address'"])] ) }}

<script>
  function checkServer() {
    var button = document.querySelector('#check-server span');
    button.style.display = 'inherit';

    var list = document.getElementById('server-list');
    var selection = list.options[list.selectedIndex];

    if (list.selectedIndex == 0) {
      alert('Select a server first');
      button.style.display = 'none';
      return;
    }

    fetch('{{ page.meta.api.server_check }}', {
      method: 'POST',
      body: JSON.stringify({
        host: selection.getAttribute('data-host'),
        port: selection.getAttribute('data-port'),
      })
    })
    .then(response => response.json())
    .then(data => {
      button.style.display = 'none';
      showResults(selection, data);
    })
    .catch(error => console.log(error));
  }

  function showResults(server, results) {
    if (results.success) {
      modalId = '{{ modalId(page.meta.modals.success) }}';
    } else {
      modalId = '{{ modalId(page.meta.modals.failure) }}';
    }

    const address = `${server.getAttribute('data-host')}:${server.getAttribute('data-port')}`;
    const modal = document.getElementById(modalId);

    modal.querySelector('#server_name').innerHTML = server.value;
    modal.querySelector('#response').innerHTML = results.message;
    modal.querySelector('#server_address').innerHTML = address;

    var owner = modal.querySelector('#server_owner');
    console.log(owner);
    if (owner !== null) {
      console.log(server.getAttribute('data-member'));
      if (server.getAttribute('data-member') == 'true') {
        owner.innerHTML = `owned by ${server.getAttribute('data-owner')}`;
      } else {
        owner.innerHTML = 'not owned by a Smash64 player';
      }
    }

    MicroModal.show(modalId);
    document.querySelector('.md-dialog').style.zIndex = 101;
    modal.querySelector('.md-button--primary').focus();
    modal.querySelector('.md-button--primary').blur();
  }
</script>

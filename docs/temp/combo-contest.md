---
section: legacy
hide:
  - next
  - prev
  - search
  - tabs
contestants:
  Prince:
    twitter: https://twitter.com/Prince_Yoshi
    youtube: https://www.youtube.com/channel/UCTETg6e0_fQO57ywoBDS3AA
  tacos:
    twitter: https://twitter.com/eztacos
  JaimeHR:
    twitch: https://www.twitch.tv/jaimehr
    twitter: https://twitter.com/JaimeHR
    youtube: https://www.youtube.com/user/JaimeHR
  Razz:
    twitter: https://twitter.com/RazztheTerrible
  CNE SSBAfro:
    twitch: https://www.twitch.tv/assiandeus1
    twitter: https://twitter.com/ssbafro
late_messages:
  - '<img src="https://cdn.discordapp.com/emojis/293566203446820875.webp?size=24&quality=lossless"> <img src="https://cdn.discordapp.com/emojis/293566203446820875.webp?size=24&quality=lossless"> <img src="https://cdn.discordapp.com/emojis/293566203446820875.webp?size=24&quality=lossless">'
  - 'Maybe try asking in <a href="https://discord.gg/ssb64">#help</a>?'
  - 64hell.com
  - At this point, it's part of the tradition.
  - CEnnis91 is holding the combo contest hostage.
  - Don't lie, you know this is whispy's fault.
  - Hold on, there's some kind of toilet paper incident delaying everything...
  - Man these messages are going to look pretty stupid if this actually starts on time.
  - The combo contest started late? Now the <b>entire</b> tournament is delayed!
  - This wouldn't have happened if we went to 3 stocks.
  - You didn't actually expect this to start on time, did you?
  - You've waited 3 years for this, what's another 3 hours?
refresh_messages_seconds: 30
show_seconds_at: 15
start: August 11, 2022 19:00:00 GMT-0400
started: 'false'
twitch: vgbootcamp
---
# Super Smash Con 2022 - Combo Contest

<div id="countdown" markdown="1" style="display: none;">
## Countdown { #hidden data-toc-label='' }

The contest is scheduled to start <b><span id='timer'></span></b>.

<div id="messages" markdown="1" style="display: none;">
<i><span id='timer-message'>&nbsp;</span></i>

[It started](javascript:contestStarted()){ .md-button .md-button--primary }
</div>
</div>

## Live Stream

<iframe
    src="https://player.twitch.tv/?channel={{ page.meta.twitch }}&parent={{ config.extra.site_domain }}"
    height="600"
    width="800"
    allowfullscreen>
</iframe>

## Contestants

{%- for name, contestant in page.meta.contestants.items() %}
- {{ name }}
{%-   if 'extra' in contestant %}
 ({{ contestant.extra }})
{%- endif %}
{%-   for brand in ['twitter', 'youtube', 'twitch'] %}
{%-     if brand in contestant %}
[:fontawesome-brands-{{ brand }}:{ .brand-{{ brand }} }]({{ contestant[brand] }})
{%-     endif %}
{%-   endfor %}
{%- endfor %}

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js" integrity="sha512-+H4iLjY3JsKiF2V6N366in5IQHj2uEsGV7Pp/GRcm0fn76aPAk5V8xB6n8fQhhSonTqTXs/klFz4D0GIn6Br9g==" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/humanize-duration/3.27.2/humanize-duration.min.js" integrity="sha512-9319lwRUPu4ggdDFT8UY3WpbWdPt72YY6wiLcDG/ofJc1Ozmi8U/rBrNe6+fI84LD/gF9iwg3C48Ex22S3iyDg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script id="__late_messages" type="application/json">{{ page.meta.late_messages | tojson | safe }}</script>

<script>
  function contestStarted() {
    var countdown = document.querySelector('#countdown');
    countdown.style.display = 'none';
    started = true;
  }

  function updateTimer(start) {
    var countdown = document.querySelector('#countdown');
    var timer = document.querySelector('#timer');
    var message = document.querySelector('#timer-message');
    var messages = document.querySelector('#messages');
    var late_messages = JSON.parse(document.querySelectorAll('#__late_messages')[0].innerHTML);

    var units = ['d', 'h', 'm'];
    var diff = -(moment().diff(start));

    if (Math.abs(diff) < ({{ page.meta.show_seconds_at }} * 60 * 1000)) {
      units.push('s');
    }

    var until = humanizeDuration(
      moment.duration(diff).asMilliseconds(),
      {
        conjunction: ' and ',
        round: true,
        serialComma: false,
        units: units,
      },
    );

    if (diff < 0) {
      timer.innerHTML = `${until} ago`;

      if (!started && -(moment().diff(last_message) > ({{ page.meta.refresh_messages_seconds }} * 1000)) && late_messages.length > 0) {
        index = Math.floor(Math.random() * late_messages.length);
        while(index == last_index) { index = Math.floor(Math.random() * late_messages.length); }

        message.innerHTML = late_messages[index];
        last_index = index;
        last_message = new Date();
      };

      messages.style.display = 'inherit';
    } else {
      timer.innerHTML = `in ${until}`;
      messages.style.display = 'none';
    }

    if (!started) {
      countdown.style.display = 'inherit';
    } else {
      countdown.style.display = 'none';
    }
  }

  // globals
  var last_index = -1;
  var last_message = 0;
  var started = {{ page.meta.started }};

  var countdown = setInterval(function() {
    updateTimer(new Date('{{ page.meta.start }}'));
  }, 1000);
</script>

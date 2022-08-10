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
late_messages: []
start: August 11, 2022 19:00:00 GMT-0400
started: 'false'
twitch: vgbootcamp
---
# Super Smash Con 2022 - Combo Contest

<div id="countdown" markdown="1" style="display: none;">
## Countdown { #hidden data-toc-label='' }

The contest is scheduled to start <b><span id='timer'></span></b>.
<br><i><span id='timer-message'>&nbsp;</span></i>
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
  function updateTimer(start, started) {
    var countdown = document.querySelector('#countdown');
    var timer = document.querySelector('#timer');
    var message = document.querySelector('#timer-message');
    var messages = JSON.parse(document.querySelectorAll('#__late_messages')[0].innerHTML);

    var units = ['d', 'h', 'm'];
    var diff = -(moment().diff(start));

    if (Math.abs(diff) < (15 * 60 * 1000)) {
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

      if (-(moment().diff(last_message) > 15000) && message.length > 0) {
        message.innerHTML = messages[Math.floor(Math.random() * messages.length)];
        last_message = new Date();
      };
    } else {
      timer.innerHTML = `in ${until}`;
    }

    if (!started) {
      countdown.style.display = 'inherit';
    } else {
      countdown.style.display = 'none';
    }
  }

  var last_message = 0;
  var countdown = setInterval(function() {
    updateTimer(new Date('{{ page.meta.start }}'), {{ page.meta.started }});
  }, 1000);
</script>

# Configuring

<style>
  .md-typeset table:not([class]) :is(th, td):not([align]) {
    vertical-align: middle;
  }
</style>

{{ advanced() }}

## Overview

{{ incomplete("section") }}

``` bash

emulinker-server/
└── conf/
    │   # access control, ip bans, etc
    ├── access.cfg
    │   # main configuration file
    ├── emulinker.cfg
    │   # changes text of various messages
    └── language.properties
```

## Initial Setup

{{ incomplete("section") }}

!!! info
    This guide assumes you are using EmulinkerSF-netsma. If the setting does not exist
    in the configuration file, it may not supported by the server version.

### emulinker.cfg

| Setting                         | Description |
| ------------------------------- | ----------- |
| emulinker.charset               | Changes the character set support<br>`Cp1251` is for English servers<br>`Shift_JIS` for Japanese servers
| controllers.connect.port        | Port that players use to connect to the server<br>Changing from `27888` will require a firewall change
| controllers.v086.portRangeStart | Starting port range that players will be assigned when they join<br>Changing from `27889` will require a firewall change
| controllers.v086.extraPorts     | Number of extra ports to reserve for admins, normally `10`
| masterList.serverName           | Name of the server displayed on kaillera master lists
| masterList.serverLocation       | Location of the server displayed on kaillera master lists
| masterList.touchKaillera        | Controls if the server will show on the [kaillera.com](http://kaillera.com/raw_server_list2.php) master list<br>Set to `true` to show or `false` to hide
| masterList.touchEmulinker       | Controls if the server will show on the [emulinker.org](http://master.emulinker.org/touch_list.php) master list<br>Set to `true` to show or `false` to hide

!!! tip
    When configuring your firewall, the ports and port range you need to open is determined by:

    - `controllers.connect.port`
    - `controllers.v086.portRangeStart` + `server.maxUsers` + `controllers.v086.extraPorts`

    When using the default settings, this range will be `27888-27999`.

### access.cfg

!!! bug "EmulinkerSF-netsma v0.4.1"
    There is a bug in some versions of EmulinkerSF-netsma that has an extra SUPERADMIN entry
    in `access.cfg`. The file should be updated before running the server to look like the following:

    ``` bash title="conf/access.cfg" linenums="31" hl_lines="4"
    ...
    #  - Grant moderator access to a dynamic DNS name
    # user,MODERATOR,dns:yourname.no-ip.org,Moderator Connected!
    # user,SUPERADMIN,183.77.163.214,
    user,SUPERADMIN,dns:localhost,Server Owner Logged In!
    ...
    ```

### languages.properties

```
Text enclosed in { }, (ie. {0} {1}) are variables on certain messages
Some characters need to include a \ before them, (ie. !)
Properties that end with a number (ie. .1) can add more messages (ie. .2)
```

??? example "Example: Change the login message"
    You can keep adding more lines to send more messages.

    ``` bash title="conf/language.properties" linenums="13"
    ...
    # Login Announcements
    KailleraServerImpl.LoginMessage.1=Welcome to my Emulinker Server\!
    KailleraServerImpl.LoginMessage.2=I should have written my own clever message here!
    KailleraServerImpl.LoginMessage.3=But instead I copied what https://smash64.online had!
    ...
    ```

??? example "Example: Expose who works for FedEx"
    Restore a joke message from Emulinker-X.

    ``` bash title="conf/language.properties" linenums="111"
    ...
    # In-Game Messages
    KailleraGameImpl.DesynchDetectedDroppedPacket={0} Clearly shouldn't work for FEDEX because he/she is dropping packets
    ...
    ```

## Tuning

{{ incomplete("section") }}

!!! info
    This guide assumes you are using EmulinkerSF-netsma. If the setting does not exist
    in the configuration file, it may not supported by the server version.

### emulinker.cfg

| Setting                         | Default       | Description |
| ------------------------------- | ------------- | ----------- |
| server.maxPing                  | `250`         | Limit users by their maximum ping
| server.allowedConnectionTypes   | `1,2,3,4,5,6` | Limits client connection types<br>1: LAN, 2: Excellent, 3: Good, 4: Average, 5: Low, 6: Bad<br>Setting to `1` is recommended
| server.maxUsers                 | `100`         | Limits the number of players on the server
| server.maxGames                 | `0`           | Limits the number of games being played, `0` is no limit
| server.allowSinglePlayer        | `true`        | Allow user to play single player, useful for troubleshooting

### access.cfg

{{ incomplete("section") }}

#### User Privileges

``` title="Filter Syntax"
user,<NORMAL|ELEVATED|MODERATOR|ADMIN|SUPERADMIN>,<ip filter>,[join message]
```

??? example "Example: Set specific IPs as admins"
    Make sure you use your own IP and not the ones in the example!

    ``` bash title="conf/access.cfg" linenums="32"
    ...
    # user,SUPERADMIN,183.77.163.214,
    user,SUPERADMIN,dns:localhost,Server Owner Logged In!
    user,SUPERADMIN,198.51.100.69,Clever login message!
    user,SUPERADMIN,dns:yourname.ddns.net,Generic join message!
    ...
    ```

??? example "Example: Quietly give a specific IP address admin"
    When there is no login message, the user will get a normal login.

    ``` bash title="conf/access.cfg" linenums="32"
    ...
    # user,SUPERADMIN,183.77.163.214,
    user,SUPERADMIN,dns:localhost,Server Owner Logged In!
    user,ADMIN,198.51.100.69,
    ...
    ```

??? example "Example: Give specific IP addresses a join message"
    Shout out to [@CongressEdits](https://twitter.com/congressedits). [RIP](https://en.wikipedia.org/wiki/CongressEdits).

    ``` bash title="conf/access.cfg" linenums="32"
    ...
    # user,SUPERADMIN,183.77.163.214,
    user,SUPERADMIN,dns:localhost,Server Owner Logged In!
    user,NORMAL,143.231.*,Someone from Congress joined the server?!
    ...
    ```

#### IP Address Access

``` title="Filter Syntax"
ipaddress,<ALLOW|DENY>,<ip filter>
```

??? example "Example: Ban a specific range of IPs"
    Deny access from [North Korea](https://en.wikipedia.org/wiki/Internet_in_North_Korea#IP_address_ranges).

    ``` bash title="conf/access.cfg" linenums="54"
    ...
    ipaddress,DENY,175.45.176.*|175.45.177.*|175.45.178.*|175.45.19.*
    ipaddress,ALLOW,*
    ...
    ```

#### Game Filters

``` title="Filter Syntax"
game,<ALLOW|DENY>,<game name filter>
```

??? example "Example: Block Chat and Away"
    ``` bash title="conf/access.cfg" linenums="69"
    ...
    game,ALLOW,*
    game,DENY,*Chat (not game)|*Away (leave messages)
    ...
    ```

??? example "Example: Only allow Smash games"
    Not advised as ROM names can change.

    ``` bash title="conf/access.cfg" linenums="69"
    ...
    # game,ALLOW,*
    game,ALLOW,*19XX*
    game,ALLOW,*Smash Brothers*
    game,ALLOW,Super Smash Bros*
    game,ALLOW,SmashRemix*
    game,DENY,*
    ...
    ```

#### Emulator Filters

``` title="Filter Syntax"
emulator,<ALLOW|DENY>,<emulator name filter>
```

??? example "Example: Only allow Project64k emulators"
    Only allow Project64k variants. Not advised if your server is public.

    ``` bash title="conf/access.cfg" linenums="82"
    ...
    # emulator,ALLOW,*
    emulator,ALLOW,Project 64k*
    emulator,DENY,*
    ...
    ```

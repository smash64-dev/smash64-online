---
title: Smash 64 Netplay Guide
section: legacy
hide:
  - next
  - prev
  - search
  - tabs
---

<style>
  .azimer-buffer-size {
    padding-left: 25px;
    padding-right: 25px;
  }
</style>

# Smash 64 Netplay Guide

To play Smash 64 online, follow the steps below. You'll be using an N64 emulator called Project64KSE, which comes with the Kaillera netplay system built-in. To use an N64 controller, you'll need a [Raphnet V3 USB adapter](https://www.raphnet-tech.com/products/n64_usb_adapter_gen3/index.php); you can also use any USB controller or a keyboard.

## 1. Download the Emulator

Download Project64KSE below and extract it to a folder. Other emulators and versions are not compatible, so make sure to get it from this link.

[Download](https://github.com/smash64-dev/project64k-legacy/releases/latest/download/project64k-legacy.zip){ .md-button .md-button--primary data-md-color-primary="green" data-md-color-accent="green" }
[GitHub](https://github.com/smash64-dev/project64k-legacy){ .md-button data-md-color-primary="green" data-md-color-accent="green" }


## 2. Obtain the Super Smash Bros. ROM { #2-obtain-rom data-toc-label='2. Obtain the Smash Bros. ROM' }

You must **legally** obtain your own ROM. This site does not endorse or condone piracy. **Do not** ask how to obtain a ROM in Discord.

If you're looking to play Smash Remix or 19XX, first obtain the normal ROM, then use our online [Remix](/remix/) or [19XX](/19XX/) patchers to generate the modded ROM.

## 3. Configure your ROM Directory { #3-set-rom-directory data-toc-label='3. Configure ROM Directory' }

Open `Project64KSE.exe` and select your ROM directory (where your ROM is located).

![rom directory selection](/assets/images/rom_directory.png)


## 4. Select your Plugins

Plugins are selected in `Options -> Settings -> Plugins`. You can configure each plugin through `Options -> Configure Plugin`.

### Graphics

#### GLideN64 Public Release 2.0 `Recommended`{ .badge data-md-color-primary="green" } `OpenGL`{ .badge data-md-color-primary="cyan" } { #glide2 data-toc-label='GLideN64 2.0' }

Correctly renders *most* things in-game and does not crash the emulator when ending emulation.

#### GLideN64 Public Release 4.0 `OpenGL`{ .badge data-md-color-primary="cyan" } { #glide4 data-toc-label='GLideN64 4.0' }

The most accurate and best looking plugin, but usually crashes the emulator when ending emulation.
![resolution](/assets/images/glide4settings.png){ align=right }

When configuring the plugin, set `Full screen resolution` to your monitor's native resolution, and aspect ratio to 4:3.

#### Jabo’s Direct3D8 1.6 `DirectX`{ .badge data-md-color-primary="cyan" } { #jabos3d8 data-toc-label='Jabo’s Direct3D8 1.6' }
Older plugin that uses less resources than GLideN64, but has visual glitches, such as not showing invincibility. Only use if you can’t run GLideN64 or OpenGL.


### Audio

#### Azimer's Audio v0.30 (Old Driver) `Recommended`{ .badge data-md-color-primary="green" } { #azimers data-toc-label="Azimer's v0.30" }

Standard audio plugin.

![audio plugin configuration](/assets/images/azimers.png){ .azimer-buffer-size align=right }

It is recommended to reduce `Buffer Size` to the 2nd tick (see image) so game audio is less delayed. This is **not saved** and must be done every time the game is launched.

#### No Sound { #nosound data-toc-label="No Sound" }

Simple audio plugin that disables sound entirely.


## 5. Configure your Controller

=== "N64 / Hori (N64 compatible controllers)"

    If your controller can plug into an N64, you'll want a [Raphnet N64 to USB adapter](https://www.raphnet-tech.com/products/n64_usb_adapter_gen3/index.php). Select the `raphnetraw 1 player NET version` controller plugin. No configuration required!

    If you have any other N64 to USB adapter, you'll need to select an N-Rage input plugin and configure your bindings manually.

=== "GameCube"

    If you have a GameCube to USB adapter, follow the instructions on the [GameCube Controller Configuration](/gamecube) page.

    If you have a GameCube to N64 adapter for console play, you can connect it to an N64 to USB adapter for maximum accuracy and follow the N64 Compatible Controllers instructions above.

=== "Keyboard"

    To use keyboard, first choose *N-Rage's Direct-Input8 1.61* as your input plugin. Then go to Configure Controller Plugin:

    1. Check Raw Data. **If you skip this step, Netplay will not work!**

    2. Press Assign Keys. In the top right, choose "Keyboard".

    3. Bind your keys according to preference and choose Apply.

=== "Xbox / Other USB"

    If you're using Windows 7, select N-Rage as your controller plugin, then choose Configure Controller Plugin and set your bindings as you like. **Ensure RawData is checked** under controller pak settings

    If you're using Windows 8 or newer, you may need to download a premade N-Rage config file. See the [Xbox Controller Configuration](/xbox) page for details.

## 6. Start Netplay

!!! danger "Ethernet Highly Recommended"
    Use a wired Ethernet connection when playing netplay. WiFi connections are inherently unreliable and will frustrate you and your opponents.

![Change mode dropdown](/assets/images/change_mode.png){ align="right" }
Launch Netplay with `File -> Start Netplay`. Use the `Change Mode` dropdown to select between `Server` or `P2P` (Peer to Peer). Peer to peer connections are more stable, but require one player to port forward in order to host. See the [P2P Setup](/p2p-check/) page for help setting up port forwarding.


The regional Discords linked in the sidebar are a great way to find opponents for P2P matches.

=== "Connecting via Server"

    1. Start Netplay. Server mode is the default.
    2. Select the server to join. A full list of servers can be found by clicking `Master Servers List`.
    3. Host or join lobbies to play
    4. Host starts game

    Up to 4 players can play in server matches.

=== "Connecting via P2P"

    1. Start Netplay. Click the `Change Mode` dropdown and select `1. P2P`.
    2. Host must have ports forwarded and provide external IP to other player
    3. Host selects the game and clicks `Host`.
    4. Client chooses the Connect tab, enters the Host's IP in the `Peer IP` box, and connects.
    5. Both players tick `Ready` to start the game

    Only 2 players can play P2P.
---

The higher your ping to the server or your opponent, the more frames of delay you'll have. Most players play on 3 frames or less. After playing online, you **must** restart the emulator before playing a different player or if a new player joins the lobby. Servers may sometimes go down and active servers may be found on the master server list.


## Frequently Asked Questions

#### When I try to play online, player 1 works fine, but player 2 can't move. { #p2cantmove data-toc-label='P2 Raw Issues' }

This is usually an issue with raw data or controller config. First, launch the game in singleplayer and make sure your controls work locally. Next, verify that players using the NRage input plugin have RawData **enabled**.

![raw data enabled](/assets/images/rawdata.png)

!!! Warning "Warning - External Plugins"
    The input plugins included in Project64KSE were chosen for their compatibility. If you're trying to use an input plugin you got elsewhere, it's likely not compatible with raw data and the cause of the issue!

Finally, make sure both players restart their emulators whenever they change opponents.

#### When I launch the emulator, I get a warning saying `raphnetraw: Adapter not detected`. { #noadapter data-toc-label='Raphnet not detected' }

![raphnet error message](/assets/images/raphnet_error.png)

This error occurs when you have the Raphnetraw input plugin selected, but you don't have a Raphnet adapter plugged in. If you don't own a Raphnet v3 USB adapter, press `OK`, then go to `Options -> Settings -> Plugins`, and follow the instructions in [Step 5](#5-configure-your-controller) to choose a different plugin for your keyboard or controller.

If you do have a Raphnet adapter, check the cable connection on both sides, and make sure the adapter management tool is not running.

#### When I launch the emulator I get a dll error, like `Current GFX dll could not be used` or `Could Not load RSP plugin` { #dllnotfound data-toc-label='Dll not found' }

These errors occurs when the emulator fails to load its plugins, and can have multiple potential causes. Try opening `Options -> Settings -> Directories`, and making sure the Plugin Directory points to the *Plugin* folder where you installed the emulator. After settings the plugins directory, open `Options -> Settings -> Plugins` and reselect all plugins, then restart the emulator. See [step 4](#4-select-your-plugins) if you're not sure which plugins to use.

If the emulator still fails to load the RSP plugin, then something on your system may be preventing it from loading; check to see if any anti-virus program is blocking access, and make sure the emulator is in a directory owned by your user.

#### My game runs fine, but the audio is delayed. { #audiolag data-toc-label='Audio Delay' }

Follow the instructions in the [Azimer's](#azimers) section above. Yes, it's annoying to set the Buffer Size every time, unfortunately this is hard to fix.

#### My game feels laggy. Is there any way to reduce input delay? { #gamelag data-toc-label='Game Lag' }

The first step is to launch the game from the main menu and check whether you're experiencing the input delay during local (non-netplay) games, or only when playing online.

If you're experiencing delay locally, try playing in full screen mode, as new version of Windows apply forced vsync to windowed applications which sometimes causes issues. You can use Alt+Enter to go fullscreen, or go to `Options -> Settings -> Options` and enable "On loading a ROM go to full screen". If you're using Glide as your graphics plugin (recommended), ensure Frame Buffer emulation is disabled but opening `Options -> Configure Graphics Plugin -> Frame Buffer` and make sure Emulate Frame Buffer is **unchecked**.

If you only experience delay when playing online, there are a variety of options for improving your network connection. Make sure to play on ethernet, not wifi. If possible, play using P2P rather than server, or look for a server close to you using the server list. When hosting P2P, you can try entering a higher delay in the `Enter custom frame delay` box. For example, if the connection is jittery on 1 frame, try forcing a 2 frame delay. The same effect can be replicated on server by spoofing a higher ping. If you frequently experience lag, you may want to investigate your network for [bufferbloat](https://www.bufferbloat.net/projects/).

#### I'm trying to configure a USB controller, but when I press a button, nothing happens. { #nocontroller data-toc-label="Can't Configure Controller" }

This is an issue with N-Rage on newer version of Windows. See the [Xbox Setup Instructions](/xbox/) for more information.

#### My question isn't here. { #discordhelp data-toc-label="Can't Find Question" }

If you are still having problems with netplay, ask in `#help` in the [Smash 64 Discord](https://discord.gg/ssb64).

## Additional Guides

- [Radiant Netplay Guide](https://docs.google.com/document/d/1jUqmsLqonkoCR_z7VBxyj6uCtpTnU6bL6oVfGEpKyZ8/view)
- [Pizza Netplay Guide (Outdated)](https://docs.google.com/document/d/1asbuKPAhHUGWgbJtLg7RJI5Hl_yDTJBlrpEQkgkgvkg/view)

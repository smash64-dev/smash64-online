---
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

# Getting Started

## Download Emulator

The Smash64 Online community primarily uses Project64KSE.

[Download](https://github.com/smash64-dev/project64k-legacy/releases/latest/download/project64k-legacy.zip){ .md-button .md-button--primary data-md-color-primary="green" data-md-color-accent="green" }
[GitHub](https://github.com/smash64-dev/project64k-legacy){ .md-button data-md-color-primary="green" data-md-color-accent="green" }


## Obtain the Smash64 ROM

You must **legally** obtain your own ROM. This site does not endorse or condone piracy. **Do not** ask how to obtain a ROM in Discord.

---


## Configure your ROM Directory

Open `Project64KSE.exe` and select your ROM directory (where your ROM is located).

![rom directory selection](/assets/images/rom_directory.png)


## Select your Plugins

Plugins are selected in `Options -> Settings -> Plugins`. You can configure each plugin through `Options -> Configure Plugin`.

### Graphics

#### GLideN64 Public Release 2.0 `Recommended`{ .badge data-md-color-primary="green" } `OpenGL`{ .badge data-md-color-primary="cyan" } { #glide2 data-toc-label='GLideN64 2.0' }

Correctly renders *most* things in-game and does not crash the emulator when ending emulation.

#### GLideN64 Public Release 4.0 `OpenGL`{ .badge data-md-color-primary="cyan" } { #glide4 data-toc-label='GLideN64 4.0' }

The most accurate and best looking plugin, but usually crashes the emulator when ending emulation.

#### Jabo’s Direct3D8 1.6 `DirectX`{ .badge data-md-color-primary="cyan" } { #jabos3d8 data-toc-label='Jabo’s Direct3D8 1.6' }
Older plugin that uses less resources than GLideN64, but has visual glitches (does not show invincibility). Only use if you can’t run GLideN64 or OpenGL.


### Audio

#### Azimer's Audio v0.30 (Old Driver) `Recommended`{ .badge data-md-color-primary="green" } { #azimers data-toc-label="Azimer's v0.30" }

Standard audio plugin. Other audio plugins may cause desyncs.

![audio plugin configuration](/assets/images/azimers.png){ .azimer-buffer-size align=right }

It is recommended to reduce `Buffer Size` to the 2nd tick (see image) so game audio is less delayed. This is **not saved** and must be done every time the game is launched.

#### No Sound { #nosound data-toc-label="No Sound" }

Simple audio plugin that disables sound entirely. Does not seem to cause desyncs.


## Configure your Controller

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

---

## Start Netplay

!!! danger "Ethernet Highly Recommended"
    Use a wired Ethernet connection when playing netplay. WiFi connections are inherently unreliable and will frustrate you and your opponents.

Launch Netplay with `File -> Start Netplay`. Use the `Change Mode` dropdown to select between `Server` or `P2P` (Peer to Peer). Peer to peer connections are more stable, but require one player to port forward in order to host. Higher ping causes higher frame delay. Most players play on 3 frames or less. You **must** restart the emulator if another player is joining or any player changes port. Servers may sometimes go down and active servers may be found on the master server list.

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


## Frequently Asked Questions

#### My game runs fine, but the audio is delayed. { #audiolag data-toc-label='Audio Delay' }

Follow the instructions in the [Azimer's](#azimers) section above. Yes, it's annoying to set the Buffer Size every time, unfortunately this is hard to fix.

#### My game feels laggy. Is there any way to reduce input delay? { #gamelag data-toc-label='Game Lag' }

The first step is to launch the game from the main menu and check whether you're experiencing the input delay during local (non-netplay) games, or only when playing online.

If you're experiencing delay locally, try playing in full screen mode, as new version of Windows apply forced vsync to windowed applications which sometimes causes issues. You can use Alt+Enter to go fullscreen, or go to `Options -> Settings -> Options` and enable "On loading a ROM go to full screen". If you're using Glide as your graphics plugin (recommended), ensure Frame Buffer emulation is disabled but opening `Options -> Configure Graphics Plugin -> Frame Buffer` and make sure Emulate Frame Buffer is **unchecked**.

If you only experience delay when playing online, there are a variety of options for improving your network connection. Make sure to play on ethernet, not wifi. If possible, play using P2P rather than server, or look for a server close to you using the server list. When hosting P2P, you can try entering a higher delay in the `Enter custom frame delay` box. For example, if the connection is jittery on 1 frame, try forcing a 2 frame delay. The same effect can be replicated on server by spoofing a higher ping. If you frequently experience lag, you may want to investigate your network for [bufferbloat](https://www.bufferbloat.net/projects/).

#### I'm trying to configure a USB controller, but when I press a button, nothing happens. { #nocontroller data-toc-label="Can't Configure Controller" }

This is an issue with N-Rage on newer version of Windows. See the [Xbox Setup Instructions](/xbox/) for more information.

#### My question isn't here. { #discordhelp data-toc-label="Can't find question" }

If you are still having problems with netplay, ask in `#help` in the [Smash 64 Discord](https://discord.gg/ssb64).

## Additional Guides

- [Radiant Netplay Guide](https://docs.google.com/document/d/1jUqmsLqonkoCR_z7VBxyj6uCtpTnU6bL6oVfGEpKyZ8/view)
- [Pizza Netplay Guide (Outdated)](https://docs.google.com/document/d/1asbuKPAhHUGWgbJtLg7RJI5Hl_yDTJBlrpEQkgkgvkg/view)

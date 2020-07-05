---
layout: home
title: Smash64 Online
subtitle: Project64K - Smash Edition
share-img: /assets/img/kirbox.png
css: /assets/css/getting-started.css
---

## Download Project64KSE

{: .center}
[Download Project64KSE](https://github.com/smash64-dev/project64k-legacy/releases/latest/download/project64k-legacy.zip){: .btn .btn-success .center}

<hr class="small">

## Obtain the Smash64 ROM

You must legally obtain your own ROM. Smash64.Online does not endorse or condone piracy. Do not ask how to obtain a ROM in Discord.

<hr class="small">

## Configure your ROM Directory

Open `Project64KSE.exe` and select your ROM directory (where your ROM is located).

<hr class="small">

## Select your Plugins
  
#### Graphics

- **GLideN64 Public Release 4.0** <span class="badge badge-success">Recommended</span> <span class="badge badge-info">OpenGL</span><br>
The most accurate and best looking plugin, but usually crashes the emulator when ending emulation.

- **GLideN64 Public Release 2.0** <span class="badge badge-info">OpenGL</span><br>
Correctly renders *most* things in-game and does not crash the emulator when ending emulation.

- **Jabo's Direct3D8 1.6** <span class="badge badge-info">DirectX</span><br>
Older plugin that uses less resources than GLideN64, but has visual glitches (does not show invincibility). Only use if you can't run GLideN64 or OpenGL. 

#### Audio

- **Azimer's Audio v0.30 (Old Driver)** <span class="badge badge-success">Recommended</span><br>
Standard audio plugin. Other audio plugins may cause desyncs. It is recommended to reduce `Buffer Size` so game audio is less delayed. This **is not saved** and must be done **every emulator restart**.

- **No Sound** <span class="badge badge-warning">Experimental</span><br>
Simple audio plugin that disables sound entirely. Does not seem to cause desyncs.

#### Controller
- **raphnetraw 1 player NET version** <span class="badge badge-success">Recommended</span> <span class="badge badge-info">Original</span> <span class="badge badge-info">Hori</span><br>
Best plug and play adapter for original and hori controllers. Both single and dual port versions work. No configuration necessary. For offline multiplayer use **raphnetraw for Project64 version 1.0.6**.

- **N-Rage** <span class="badge badge-info">Xbox</span> <span class="badge badge-info">Playstation</span> <span class="badge badge-info">Keyboard</span><br>
Used with 3rd-party controllers/adapters, like Xbox/PS3/PS4/Keyboard. There are 3 versions available, and up to preference. You must map your own buttons, and **enable RAW data**.

<hr class="small">

## Cheats

Make sure the <code>1. Netplay Required</code> cheat is checked when you set up Project64KSE for the first time. This is a one time process and **does not** need to be done every time you launch the emulator. Start the game first to apply the cheat. If you use cheats other than `1. Netplay Required` you may need to recheck your cheats every time you launch the game.

<hr class="small">

## Start Netplay

A netplay game can either be via `Server` or `P2P`. Higher rping causes higher frame delay. Most players will play on 2 frames or less, some may tolerate 3 frames. You **must** restart the emulator if another player is joining or any player changes port. Servers may sometimes go down and active servers may be found on the master server list.

#### Connecting via Server

- Join server
- Host or join lobbies to play
- Host starts game
- Up to 4 players can play

#### Connecting via P2P

- Host must have ports forwarded and provide external IP to other player
- Both players tick `Ready` to start the game
- Up to 2 players can play

<hr class="small">

## Questions

If you are still having trouble ask in `#help` in the main Smash64 discord.\\
[Outdated Guide](https://docs.google.com/document/d/1asbuKPAhHUGWgbJtLg7RJI5Hl_yDTJBlrpEQkgkgvkg/view)
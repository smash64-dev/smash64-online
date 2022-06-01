---
hide:
  - next
  - prev
  - tabs
---

# Getting Started


## Download Emulator

The Smash64 Online community primarily uses Project64KSE.

[Download](https://github.com/smash64-dev/project64k-legacy/releases/latest/download/project64k-legacy.zip){ .md-button .md-button--primary data-md-color-primary="green" data-md-color-accent="green" }
[GitHub](https://github.com/smash64-dev/project64k-legacy){ .md-button data-md-color-primary="green" data-md-color-accent="green" }


## Obtain the Smash64 ROM

You must **legally** obtain your own ROM. This site does not endorse or condone piracy. **Do not** ask how to obtain a ROM in Discord.


## Configure your ROM Directory

Open `Project64KSE.exe` and select your ROM directory (where your ROM is located).


## Select your Plugins


### Graphics

#### GLideN64 Public Release 4.0 `Recommended`{ .badge data-md-color-primary="green" } `OpenGL`{ .badge data-md-color-primary="cyan" } { #markdown data-toc-label='GLideN64 4.0' }

The most accurate and best looking plugin, but usually crashes the emulator when ending emulation.

#### GLideN64 Public Release 2.0 `OpenGL`{ .badge data-md-color-primary="cyan" } { #markdown data-toc-label='GLideN64 2.0' }

Correctly renders *most* things in-game and does not crash the emulator when ending emulation.

#### Jabo’s Direct3D8 1.6 `DirectX`{ .badge data-md-color-primary="cyan" } { #markdown data-toc-label='Jabo’s Direct3D8 1.6' }
Older plugin that uses less resources than GLideN64, but has visual glitches (does not show invincibility). Only use if you can’t run GLideN64 or OpenGL.


### Audio

#### Azimer's Audio v0.30 (Old Driver) `Recommended`{ .badge data-md-color-primary="green" } { #markdown data-toc-label="Azimer's v0.30" }

Standard audio plugin. Other audio plugins may cause desyncs. It is recommended to reduce `Buffer Size` so game audio is less delayed. This is **not saved** and must be done every emulator restart.

#### No Sound { #markdown data-toc-label="No Sound" }

Simple audio plugin that disables sound entirely. Does not seem to cause desyncs.


### Controller

#### raphnetraw 1 player NET version `Recommended`{ .badge data-md-color-primary="green" } `Original`{ .badge data-md-color-primary="cyan" } `Hori`{ .badge data-md-color-primary="cyan" } { #markdown data-toc-label="raphnetraw 1 player NET" }

Best plug and play adapter for original and hori controllers. Both single and dual port versions work. No configuration necessary. For offline multiplayer use `raphnetraw for Project64 version`.

#### N-Rage `Xbox`{ .badge data-md-color-primary="cyan" } `Playstation`{ .badge data-md-color-primary="cyan" } `Keyboard`{ .badge data-md-color-primary="cyan" } { #markdown data-toc-label="N-Rage" }

Used with 3rd-party controllers/adapters, like Xbox/PS3/PS4/Keyboard. There are 3 versions available, and up to preference. You must map your own buttons, and **enable RAW data**.


### Cheats

Make sure the `1. Netplay Required` cheat is checked when you set up Project64KSE for the first time. This is a one time process and **does not** need to be done every time you launch the emulator. Start the game first to apply the cheat. If you use cheats other than `1. Netplay Required` you may need to recheck your cheats every time you launch the game.


### Start Netplay

A netplay game can either be via `Server` or `P2P`. Higher ping causes higher frame delay. Most players will play on 2 frames or less, some may tolerate 3 frames. You **must** restart the emulator if another player is joining or any player changes port. Servers may sometimes go down and active servers may be found on the master server list.

#### Connecting via Server

- Join server
- Host or join lobbies to play
- Host starts game
- Up to 4 players can play


#### Connecting via P2P

- Host must have ports forwarded and provide external IP to other player
- Both players tick `Ready` to start the game
- Up to 2 players can play


### Questions

If you are still having trouble ask in `#help` in the main Smash64 discord. [Outdated Guide](https://docs.google.com/document/d/1asbuKPAhHUGWgbJtLg7RJI5Hl_yDTJBlrpEQkgkgvkg/view)

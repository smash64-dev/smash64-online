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
  .md-typeset .download-note {
    margin-bottom: 0;
  }
  .md-typeset .download-note + h2 {
    margin-top: .6em;
  }
</style>

# Smash 64 Netplay Guide

To play Smash 64 online with rollback, follow the steps below. To use an N64 controller, you'll want a [Raphnet V3 USB adapter](https://www.raphnet-tech.com/products/n64_usb_adapter_gen3/index.php); you can also use a Gamecube controller, any USB controller, or a keyboard.

## 1. Download the RMG-K Emulator

[Download](https://github.com/Jay-Day/RMG-K/releases/latest){ .md-button .md-button--primary data-md-color-primary="green" data-md-color-accent="green" }
[GitHub](https://github.com/Jay-Day/RMG-K){ .md-button data-md-color-primary="green" data-md-color-accent="green" }

<small style="color: var(--md-default-fg-color--light);">(Scroll to the bottom, download files are under Assets)</small>
{: .download-note }

## 2. Obtain the Smash Bros. ROM

The Smash Bros game file, or ROM, is required to play online. You must **legally** obtain your own ROM. This site does not endorse or condone piracy. **Do not** ask how to obtain a ROM in Discord.

!!! Note "ROM Patching"
    Many online players play on modded versions of the game, such as Smash Remix or 19XX. Use our online [Remix](remix.md) or [19XX](19XX.md) patchers to modify your ROM.

## 3. Select your ROM Directory { #3-set-rom-directory data-toc-label='3. Configure ROM Directory' }

Open `RMG-K.exe` and click Select ROM Directory, then pick the folder where you saved the ROM.

## 4. Configure your Controller

Press the **Input** button to configure your controller. Select your controller type, USB, Gamecube, or N64.

![plugins](assets/images/plugins3.png){ width=50% }

- If you're using a Gamecube controller, make sure your adapter is in **Native** mode. If your adapter doesn't support Native mode, choose USB Controller as the controller type.
- If you're using an N64 controller with a Raphnet adapter, your controls will automatically be configured to match console, so there's no need to adjust settings.

## 5. Start Netplay

!!! danger "Ethernet Highly Recommended"
    Use a wired Ethernet connection when playing netplay. WiFi connections are inherently unreliable and will frustrate you and your opponents.

Launch online play with the `Netplay` button. There you can create a room or join an opponent to play.

If you're having problems setting up netplay, ask in `#help` in the [Smash 64 Discord](https://discord.gg/ssb64).

## FAQ

### My Gamecube controller isn't working!

If your Gamecube adapter supports native input:

1. Make sure the Controller Type is set to Gamecube
2. Make sure the adapter is set to native mode
3. Make sure you don't have any other programs (Dolphin, etc) using the adapter
4. Try unplugging and replugging the adapter and restarting RMG-K
5. Try restarting the PC

Native adapters often have issues when being used by multiple processes at once.

If it doesn't support native input:
Make sure your Controller Type is set to USB, and the adapter is set as the device in input config. You may need to calibrate the controller through Windows.

### Legacy Emulators & Guides

- [Project64 KSE (Emulator)](https://github.com/smash64-dev/project64k-legacy/releases/latest/download/project64k-legacy.zip)
- [Project64k-legacy (GitHub)](https://github.com/smash64-dev/project64k-legacy)
- [Radiant Netplay Guide](https://docs.google.com/document/d/1jUqmsLqonkoCR_z7VBxyj6uCtpTnU6bL6oVfGEpKyZ8/view)
- [Pizza Netplay Guide (Outdated)](https://docs.google.com/document/d/1asbuKPAhHUGWgbJtLg7RJI5Hl_yDTJBlrpEQkgkgvkg/view)

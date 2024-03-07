---
section: legacy
hide:
  - next
  - prev
  - search
  - tabs
---

## Input Plugin

The recommended controller plugin for Xbox and other USB controllers is `N-Rage V2 1.83`, which is included with the emulator. Make sure to select it as your input plugin by going to `Options -> Settings -> Plugins.` These instructions **won't work** if you're using a different input plugin, such as `N-Rage Input Plugin V2 2.3c`.

## Configuring Inputs

#### Windows 10+

Newer Windows versions have broken the configuration dialog for N-Rage, preventing us from setting bindings. To use an Xbox controller on one of these versions, you'll need to download a pre-set N-Rage configuration here:

* [Z_Triggers.cpf](assets/files/Z_Triggers.cpf)
* [Z_Bumpers.cpf](assets/files/Z_Bumpers.cpf)
* [Z_Bumpers_X_and_B_Swap.cpf](assets/files/Z_Bumpers_X_and_B_Swap.cpf)

As the names suggest, `Z_Triggers` has N64 Z bound to the Xbox's triggers, `Z_Bumpers` has it bound to the bumpers, and `Z_Bumpers_X_and_B_Swap` has the X and B face buttons swapped.

To load these files, open `Options -> Configure Controller Plugin`, then click `Load Profile`.

<!--
  TODO: this might actually be wrong
  Windows 8 and 8.1 might suffer from this bug
-->
#### Older Windows

Under Windows 7, 8, and 8.1, Xbox controllers can be configured normally through N-Rage. Simply open `Options -> Configure Controller Plugin`, select your controller, and press the buttons that you want to bind to each input.

!!! warning
    These operating systems have been declared [end of life](https://www.microsoft.com/en-us/windows/end-of-support) by Microsoft, and for security reasons you should consider updating.

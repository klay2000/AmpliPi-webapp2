The schematics for all shipped AmpliPi units are available in this directory.
This document details the specific board versions that were shipped together.

Board versions consist of a number and a letter.
A number change indicates a change to the PCB.
A letter change indicates a change to the schematics only.
Schematic changes could include part number changes, DNPs, etc.

# AmpliPi Controllers

### Developer Units
The first 5 Kickstarter backers' units.

| Board      | Version                                         |
| ---------- | ----------------------------------------------- |
| Amplifier  | [1.A](amplifier_board/amplifier_board_1a.pdf)   |
| Controller | [2.A](controller_board/controller_board_2a.pdf) |
| LED        | [2.A](led_board/led_board_2a.pdf)               |
| Power      | [2.A](power_board/power_board_2a.pdf)           |
| Preamp     | [2.A](preamp_board/preamp_board_2a.pdf)         |
| Preout     | [0.A](preout_board/preout_board_0a.pdf)/[1.A](preout_board/preout_board_1a.pdf)* |

\* 0.A/1.A are effectively the same, see the [Preout Board CHANGELOG](preout_board/CHANGELOG.md)

### Early Bird Units and Kickstarter Campaign Part 1
The 10 Early Bird Kickstarter backers' units,
as well as the first 15 of the rest of the Kickstarter Campaign backers.
The overall goal of these hardware changes was to reduce noise
and to improve fan control.

| Board      | Version                                         |
| ---------- | ----------------------------------------------- |
| Amplifier  | [2.B](amplifier_board/amplifier_board_2b.pdf)   |
| Controller | [3.A](controller_board/controller_board_3a.pdf) |
| LED        | [2.A](led_board/led_board_2a.pdf)               |
| Power      | [3.B](power_board/power_board_3b.pdf)           |
| Preamp     | [3.A](preamp_board/preamp_board_3a.pdf)         |
| Preout     | [1.A](preout_board/preout_board_1a.pdf)         |

### CURRENT HARDWARE RELEASE - serial numbers >= 129
This is the currently shipping hardware release.
The overall goal of these hardware changes was to further reduce audio noise,
add quieter fan control, and replace parts unavailable due to the global
chip shortage.

| Board          | Version                                         |
| -------------- | ----------------------------------------------- |
| Amplifier[^1]  | [3.A](amplifier_board/amplifier_board_3a.pdf)   |
| Controller     | [4.A](controller_board/controller_board_4a.pdf) |
| LED            | [2.A](led_board/led_board_2a.pdf)               |
| Power          | [4.A](power_board/power_board_4a.pdf)           |
| Preamp         | [3.A](preamp_board/preamp_board_3a.pdf)         |
| Preout         | [1.A](preout_board/preout_board_1a.pdf)         |

# Zone Expanders
Zone Expanders add 6 more zones each to an AmpliPi Controller.
They do not have a control board in them, but rather an expansion board
that acts as a pass-through for audio and control signals.
Up to 5 Zone Expanders can be added to one Controller.

### CURRENT HARDWARE RELEASE - serial numbers >= 100

| Board         | Version                                         |
| ------------- | ----------------------------------------------- |
| Amplifier[^1] | [3.A](amplifier_board/amplifier_board_3a.pdf)   |
| Expansion     | [3.A](expansion_board/expansion_board_3a.pdf)   |
| LED           | [2.A](led_board/led_board_2a.pdf)               |
| Power[^2]     | [4.A](power_board/power_board_4a.pdf)           |
| Preamp[^2]    | [3.A](preamp_board/preamp_board_3a.pdf)         |
| Preout        | [1.A](preout_board/preout_board_1a.pdf)         |

[^1]: The TDA7492E amplifier is used on standard units and high-powered
      units use the TDA7498E.
[^2]: Unused components such as the Preamp's RCA inputs are removed.

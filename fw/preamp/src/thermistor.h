/*
 * AmpliPi Home Audio
 * Copyright (C) 2021 MicroNova LLC
 *
 * Thermistor temperature conversion look-up tables.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

#ifndef THERMISTOR_H_
#define THERMISTOR_H_

#include <stdint.h>

// Amplifiers: TDA7492E max temp = 85C
// Power supply: MEAN WELL LRS-350 max temp = 70C
// Raspberry Pi: BCM2837 max temp = 85C, CM3+ max temp = 80C
#define TEMP_THRESH_LOW_C      40  // Below this fans turn off
#define TEMP_THRESH_HIGH_C     45  // Above this fans turn on
#define TEMP_THRESH_OVR_C      70  // Above this warn of overtemp
#define TEMP_THRESH_LOW_UQ7_1  (2 * (TEMP_THRESH_LOW_C + 20))
#define TEMP_THRESH_HIGH_UQ7_1 (2 * (TEMP_THRESH_HIGH_C + 20))
#define TEMP_THRESH_OVR_UQ7_1  (2 * (TEMP_THRESH_OVR_C + 20))

// NCP21XV103J03RA - 0805 SMD, R0 = 10k @ 25 degC, B = 3900K
const uint8_t THERM_LUT_[] = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x02, 0x05, 0x08, 0x0A, 0x0D, 0x0F, 0x11, 0x13, 0x15, 0x17, 0x19, 0x1B,
    0x1C, 0x1E, 0x20, 0x21, 0x23, 0x24, 0x26, 0x27, 0x28, 0x2A, 0x2B, 0x2C,
    0x2E, 0x2F, 0x30, 0x31, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
    0x3B, 0x3C, 0x3E, 0x3F, 0x40, 0x41, 0x42, 0x43, 0x43, 0x44, 0x45, 0x46,
    0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F, 0x4F, 0x50, 0x51,
    0x52, 0x53, 0x54, 0x55, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0x5A, 0x5B,
    0x5C, 0x5D, 0x5E, 0x5E, 0x5F, 0x60, 0x61, 0x62, 0x62, 0x63, 0x64, 0x65,
    0x66, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 0x6E,
    0x6F, 0x70, 0x71, 0x71, 0x72, 0x73, 0x74, 0x75, 0x75, 0x76, 0x77, 0x78,
    0x79, 0x79, 0x7A, 0x7B, 0x7C, 0x7D, 0x7D, 0x7E, 0x7F, 0x80, 0x81, 0x81,
    0x82, 0x83, 0x84, 0x85, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8A, 0x8A, 0x8B,
    0x8C, 0x8D, 0x8E, 0x8F, 0x90, 0x91, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96,
    0x97, 0x98, 0x99, 0x9A, 0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F, 0xA0, 0xA1,
    0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAB, 0xAC, 0xAD, 0xAE,
    0xAF, 0xB0, 0xB1, 0xB2, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xBA, 0xBB, 0xBC,
    0xBD, 0xBF, 0xC0, 0xC1, 0xC3, 0xC4, 0xC6, 0xC7, 0xC9, 0xCA, 0xCC, 0xCD,
    0xCF, 0xD0, 0xD2, 0xD4, 0xD5, 0xD7, 0xD9, 0xDB, 0xDD, 0xDF, 0xE0, 0xE3,
    0xE5, 0xE7, 0xE9, 0xEB, 0xED, 0xF0, 0xF2, 0xF5, 0xF7, 0xFA, 0xFD, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF,
};

#endif /* THERMISTOR_H_ */

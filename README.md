# TAGE

Text Adventure Game Engine

## Goal

Provide a sensible SDK for creating text adventure games.

## Structure

- Game
  - Command
    - Look
    - Examine
    - Pickup
    - Drop
    - Use
    - Go
    - Exit
  - Room
  - Inventory
  - Object
    - Command (actions I respond to)

### What is a Command?

A Command represents itself as a an action in the engines UI.

For example:

- Go -> `go north`
- Look -> `look`

Commands are executed by leveraging functions.

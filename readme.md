# Hot Meaty Clay's Discord Bot

## Glossary

- Player: Person with a registered account in Undead Dawn
- Guild: Undead Dawn's discord server
- Member: Person inside the guild
- Game: Undead Dawn's backend servers

## Requirements
1. Rename members
 * The bot must be able to rename every linked member to their respective IGNs

2. Allow voice chat to linked members
 * The bot must be able to allow access to voice chat only to the members who are linked

3. Handle banned players
 * The bot must be able to remove access to all text and voice channels to banned players
 * The bot must be able to give them access to a special channel to discuss their situation

## API

POST /user

### Request

|Name|Type|Description|
|-|-|-|
|username|String|The new username the discord account will have. Basically, the IGN
|discordId|String|The discord account's id

### Response

|Name|Type|Description|
|-|-|-|
|Error|String?|A description of the error that occurred

### Posible return codes

|Code|
|-|
|200|
|400|
|500|
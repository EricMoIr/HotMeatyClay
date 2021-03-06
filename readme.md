# Hot Meaty Clay's Discord Bot

## Invite link

https://discordapp.com/oauth2/authorize?client_id=529867216590602251&scope=bot&permissions=402661392

Why 402661392 as permissions? This bot requires
- Manage roles to create the Banned role
- Manage channels to make the Banned role affect every channel
- Manage nicknames to change them to the IGN
- Mannage messages to delete messages with $purge

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

4. Handle new members
    * The bot must be able to fulfill the above requirements not only on the current members but also on all new members joining the guild

5. Announcements (planned)
    * The bot must be able to announce the winners and/or top placed players of the major competitions

6. Delete messages
    * The bot must be able to delete the n oldest messages with the command $purge n
    * Only Devs and Mods should be able to use this command
    * A Mod should not be able to delete a message written by a Dev

## API

https://hot-meaty-clay.herokuapp.com

POST /user

### Request

|Name|Type|Description|
|-|-|-|
|username|String|The new username the discord account will have. Basically, the IGN
|discordId|String|The discord account's id
|isBanned|Bool?|Whether this player is banned or not

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

PUT /user/<discord_id>

### Request

|Name|Type|Description|
|-|-|-|
|username|String|The new username the discord account will have. Basically, the IGN
|isBanned|Bool?|Whether this player is banned or not

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

# Playtime Tracking and Synchronization Script

### Overview

This script provides real-time tracking and synchronization of player playtime for FiveM servers.

---

### Features

* **Real-time Playtime Tracking**: Updates playtime for each connected player every minute.
* **MySQL Integration**: Ensures persistent storage of player playtime data.
* **Dynamic Sync**: Periodically fetches all playtime data and sends it to the JavaScript side for advanced usage.
* **Reset Functionality**:
  * Reset playtime for a specific player by their license.
  * Reset playtime for all players in the database.
* **Compatibility**: Fully compatible with frameworks and standalone setups.

---

### Installation

1. **Download and Extract**
  * Download the script files and place them in your server's `resources` folder.
2. **Configure Database**
  * Ensure you have a MySQL database set up.
  * Create a table for playtime using the following schema:

```
CREATE TABLE `playtime` (
    `license` VARCHAR(255) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `playtime` INT NOT NULL DEFAULT 0
);
```

3. **Add to Server Config**
  * Add the resource to your `server.cfg` :

```
ensure xdc-playtimetracker
```
4. **Start Your Server**
  * Restart your server to load the resource.

---

### Events and Usage

#### Discord Commands

1. **Check Playtime**
  * Use the `/playtime check` command with the player’s license to view their playtime details.
2. **Reset Playtime for Specific License**
  * Use the `/playtime reset [license]` command with the player’s license to clear their playtime.
3. **Reset All Playtimes**
  * Use the `/playtime reset` command without a license to clear all stored playtimes.
4. **Dynamic Embeds**
  * Playtime details are displayed in rich embeds with player information, license, and minutes played.

---

### Notes

* **Performance Optimized**: Efficient loops and database queries ensure minimal impact on server performance.
* **Extensible**: Easily integrate with Discord bots.
* **Database Indexing**: Ensure the `license` column is indexed for optimal query performance.

---

### Support

For questions, bugs, or suggestions, feel free to reach out on the [Discord](https://discord.gg/6kVcZrym).

/* global HydnaChannel */

/**
 * Chain.js is a library to assist anyone with taking part in the S4 chain reaction workshop.
 *
 * Depends on Hydna library to connect to its pub/sub service.
 *
 * @author Olaf Janssen <olaf.janssen@fontys.nl>
 */
var chain = {

    channel: new HydnaChannel('http://###yourchannel###.hydna.net', 'rw'),
    position: 0,

    /**
     * Start listening to changes in the chain position.
     * When a messages arrives for the user's position the callback is called and the user can start it's chain animation.
     *
     * @param pos       The position of the user in the chain (0 is the start of the link).
     * @param callback  The function to be called when it's the users' turn in the chain.
     */
    start: function (pos, callback) {
        'use strict';

        this.position = pos;

        // if the channel opens and the user is the start of the chain, reset the chain
        this.channel.onopen = function () {
            chain.channel.send('p' + chain.position);
        };

        // listen to messages and respond if the current link in the chain is that of the user
        this.channel.onmessage = function (event) {
            if (event.data === 'p' + chain.position) {
                callback();
            }
        };
    },

    /**
     * Function to be called when the user's chain animation has finished and the next link in the chain should start.
     * Publishes a messages on the channel with the updates position.
     */
    done: function () {
        'use strict';

        this.channel.send('p' + (this.position + 1));
    }

};

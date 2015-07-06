var settings = require('mit-settings');

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['Seed Trip'],
  /**
   * Your New Relic license key.
   */
  license_key : '8a52fd56572d96c50447cbee3707f4554c6c5e30',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : settings.env.mode=='production' ? 'info' : 'trace'
  }
};

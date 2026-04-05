var GetUsersCIs = Class.create();
GetUsersCIs.prototype = Object.extendsObject(AbstractAjaxProcessor, {

 getUsersCIs: function() {

        var user = current.caller_id;

        var grUsers = new GlideRecord('cmdb_ci');
        grUsers.addQuery('assigned_to', '!=', '');
        grUsers.addQuery('assigned_to', user);
        var gr1 = grUsers.addQuery('install_status', '1');
        gr1.addOrCondition('install_status', '3');
        gr1.addOrCondition('install_status', '9');
        grUsers.query();
        gs.log("Script include - Users found " + grUsers.getRowCount() + " records");

        var lpArray = [];

        while (grUsers.next()) {
            lpArray.push(grUsers.sys_id.toString());
        }

        return 'sys_idIN' + lpArray;
    },
    getUsersReleaseCIsRP: function() {

        var user = current.variables.assests;
        gs.log("USER: " + user);

        var grUsers = new GlideRecord('cmdb_ci');
        grUsers.addQuery('assigned_to', '!=', '');
        grUsers.addQuery('assigned_to', user);
        var gr1 = grUsers.addQuery('install_status', '1');
        gr1.addOrCondition('install_status', '3');
        gr1.addOrCondition('install_status', '9');
        grUsers.query();
        gs.log("Script include - Users found " + grUsers.getRowCount() + " records");

        var lpArray = [];

        while (grUsers.next()) {
            lpArray.push(grUsers.sys_id.toString());
        }

        return 'sys_idIN' + lpArray;
    },
    type: 'GetUsersCIs'
});
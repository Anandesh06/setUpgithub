var SetUPGitHUB = Class.create();
SetUPGitHUB.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	storeSysId: function() {
    var sysId = this.getParameter('sysparm_sys_id');
    gs.getSession().putProperty('github_sys_id', sysId);
	gs.log("umasysid"+sysId);
    return "stored";
},
commitCode: function () {
  var sysId = gs.getSession().getProperty('github_sys_id'); // ✅ HERE

    if (!sysId) {
        return "No sys_id found in session";
    }
    var action = this.getParameter('sysparm_value1');
    var repoName = this.getParameter('sysparm_value2');
    var repoUploadName = this.getParameter('sysparm_value3');
    var fileUpdateName = this.getParameter('sysparm_value4');
    // var sysId = this.getParameter('sysparm_sys_id');
    var newFile = this.getParameter('sysparm_value6');

    // 🔥 Fetch Script Include code from sys_id
    var gr = new GlideRecord('sys_script_include');
    if (!gr.get(sysId)) {
        return "Script Include not found";
    }

    var rawCode = gr.script; // ✅ correct
    var encodedString = GlideStringUtil.base64Encode(rawCode); // ✅ encode once

if (action == 'create') {
    return this.createRepo(repoName, encodedString, newFile);
}
    else if (action == 'upload') {
        this.uploadFile(repoUploadName, encodedString, newFile);
    }
    else if (action == 'update') {
        this.updateFile(repoUploadName, encodedString, fileUpdateName);
    }

    return 'success';
},

 createRepo: function (repoName, encodedString, newFile) {

    var r = new sn_ws.RESTMessageV2('Github', 'Create Repo');
    r.setRequestBody(JSON.stringify({
        name: repoName,
        private: false
    }));

    var response = r.execute();
    var body = response.getBody();

    gs.info("CREATE REPO RESPONSE: " + body);

    // 🔥 CHECK STATUS
    if (response.getStatusCode() != 201) {
        return "Repo creation failed: " + body;
    }

    // 🔥 Upload file
    var rUpload = new sn_ws.RESTMessageV2('Github', 'Upload Code');
    rUpload.setEndpoint(
        'https://api.github.com/repos/Anandesh06/' + repoName + '/contents/' + newFile + '.js'
    );

    rUpload.setRequestBody(JSON.stringify({
        message: 'Initial commit from ServiceNow',
        content: encodedString,
        branch: 'main'
    }));

    var uploadResponse = rUpload.execute();
    var uploadBody = uploadResponse.getBody();

    gs.info("UPLOAD RESPONSE: " + uploadBody);

    return "Repo + File Created";
},

  uploadFile: function (repoName, encodedString, newFile) {
    var rUpload = new sn_ws.RESTMessageV2('Github', 'Upload Code');
    rUpload.setEndpoint(
      'https://api.github.com/repos/Anandesh06/' + repoName + '/contents/' + newFile + '.js'
    );
    rUpload.setRequestBody(JSON.stringify({
      message: 'Add new file from ServiceNow',
      content: encodedString,
      branch: 'main'
    }));
    rUpload.execute();
  },

  updateFile: function (repoName, encodedString, fileName) {

    var rSHA = new sn_ws.RESTMessageV2('Github', 'GET SHA');
    rSHA.setEndpoint(
      'https://api.github.com/repos/Anandesh06/' + repoName + '/contents/' + fileName + '.js'
    );
    var response = rSHA.execute();
    var body = JSON.parse(response.getBody());
    var sha = body.sha;

    var rUpdate = new sn_ws.RESTMessageV2('Github', 'Upload Code');
    rUpdate.setEndpoint(
      'https://api.github.com/repos/Anandesh06/' + repoName + '/contents/' + fileName + '.js'
    );
    rUpdate.setRequestBody(JSON.stringify({
      message: 'Update file from ServiceNow',
      content: encodedString,
      sha: sha,
      branch: 'main'
    }));
    rUpdate.execute();
  },

    type: 'SetUPGitHUB'
});
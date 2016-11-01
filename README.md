# SP-JS-ProvisioningEngine
##Introduction##
The goal of this project is to develop a solution that will use json-based tempalte to create sites. The solution contains a SharePiont-hosted Add-In that needs:
- Needs to be installed at site collection level
- Needs Site Collection Admin permission to use the app
- Full permission at site collection level

##Tempaltes##
All the templates are JSON based stored in a lists in the Add-In with url like 'add-in-site-url/lists/templates'. If you open the solution in Visual Studio and edit JSON template you will get intelliesen as JSON schema is provided in the solution (file name pnp-schema.json). The tempalte schema is similar to PnP XML schema. The Add-In uses two types of templates - Site Template and Feature Tempalte.
###Site Tempalte###
Site tempaltes are used to creates sites and these tempaltes are only available in 'create subsite' page.

###Feature Template###
Feature templates are used to apply new artefacts in existing sites. 

##Add-In ##
The Add-In home pages shows existings sites and subsites in treeview. Site Collection Admin will be able to create a new subsite or manage feature templates as shown below:

###Create Sub-Site###

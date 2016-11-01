##Introduction##
The solution is a SharePoint Add-In. The following tools/frameworks are used to develop the Add-In:
- Knockout
- TypeScript
- jsTree
- requireJS
- jQuery and jQuery UI
- JSON

##Pages##
The Add-In has three following pages:
- Home Page (Pages/Default.aspx): This page shows the sites as treeview with option to create subsites or manage tempaltes for selected site.
- Create Subsite (Pages/SiteTempalte.aspx): This page is used to create subsites
- Manage Feature Templates (pages/FeatureTemplate.aspx): To manage feature templates for selected site.

##Site Columns and Content Types and Lists##
The app creates a content types 'Site Feature Template' with the following fields:
- Tempalte ID (text): Unique Id of the tempalte
- Template Type (choice): type of template - feature or site tempalte (site tempalte is used to create site, wherease feature template is used to apply template on existing site)
- Template Description (note): description of the template
- Template Dependenceis (multi-lookup): not used at this time, but plan is to specify template dependencies so that a child feature template cannot be applied before dependant one  

The Add-In then creates a document library 'Tempaltes' with Url (https://{add-in-url}/lists/templates) and use the conten type 'Site Feature Template' in it. 

##Templates##
As part of the add-in I've developded few templates already. To create a new template, copy an existing template and modify as required. Then you can redeploy the Add-In or manually upload the template in 'Templates' library in Add-In site.   
   
When you will edit the new template in Visual Studio, you will get intellisense as shown below. The intellisense works because of the '$schema' attribute applied at the very beginning of the file:
![JSON Intellisense](https://github.com/ranaictiu/SP-JSON-Provisioning-Engine/blob/master/Miscellaneous/JSON%20Intellisense.png)

##Conclusion##
Feel free to use and contribute!


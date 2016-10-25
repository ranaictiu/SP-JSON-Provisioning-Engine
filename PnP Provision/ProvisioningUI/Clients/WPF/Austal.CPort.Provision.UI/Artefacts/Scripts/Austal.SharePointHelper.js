/// <reference path="../../_layouts/15/init.debug.js" />
/// <reference path="../../_layouts/15/SP.Core.debug.js" />
/// <reference path="../../_layouts/15/SP.Runtime.debug.js" />
/// <reference path="../../_layouts/15/SP.debug.js" />
/// <reference path="../../_layouts/15/sp.workflowservices.debug.js" />
/// <reference path="../../_layouts/15/SP.DocumentManagement.debug.js" />
/// <reference path="../../_layouts/15/sp.publishing.debug.js" />


var austal = austal || {};

austal.spHelper = austal.spHelper || (function () {

    var _webAvailableContentTypes = null;


    var initialize = function () {
        _webAvailableContentTypes = null;
    };
    //BEGIN - private functions

    //sometime app context or host web context is provided to sharepoint helper. App context doesn't have load/execute method
    // rather the actual context is found from context.get_context() 
    var getExecuteContext = function (ctx) {
        return ctx.load ? ctx : ctx.get_context();
    }

    //add existing field to list content type (not web)
    function addExistingFieldToListContentType(context, listTitle, contentTypeId, fieldInternalName) {

        var web = context.get_web();
        var list = web.get_lists().getByTitle(listTitle);
        var contentType = list.get_contentTypes().getById(contentTypeId);
        var taxKeywordField = list.get_fields().getByInternalNameOrTitle(fieldInternalName);

        var fieldLink = new SP.FieldLinkCreationInformation();
        fieldLink.set_field(taxKeywordField);
        contentType.get_fieldLinks().add(fieldLink);
        contentType.update();
        return getExecuteContext(context).executeQueryPromise();
    };

    //find a web content type by name
    function getWebContentTypeByName(context, contentTypeName, properties, callback) {

        var contentType = null;
        var d = $.Deferred();
        var web = context.get_web();

        if (_webAvailableContentTypes) { //first check cached content types 
            contentType = ko.utils.arrayFirst(_webAvailableContentTypes, function (c) {
                return c.get_name() == contentTypeName;
            });
            if (contentType) {
                callback(contentType);
                d.resolve();
                return d;
            }
        }

        //content type not found in cached list, so load fresh
        var availableContentTypes = web.get_availableContentTypes();
        var executeContext = getExecuteContext(context);
        if (properties != null && !properties.startsWith('Include(')) {
            properties = "Include({0})".format(properties);
        }
        if (properties)
            executeContext.load(availableContentTypes, properties);
        else
            executeContext.load(availableContentTypes);
        executeContext.executeQueryAsync(function () {
            _webAvailableContentTypes = austal.spHelper.getEnumerationList(availableContentTypes);
            contentType = ko.utils.arrayFirst(_webAvailableContentTypes, function (c) {
                return c.get_name() == contentTypeName;
            });

            callback(contentType);
            d.resolve();
        },
            function () {
                callback(null);
                d.reject();
            });
        return d;
    }

    //activate web level feature
    function activateWebFeature(context, featureId, scope) {
        var d = $.Deferred();
        var web = context.get_web();
        var features = web.get_features();
        features.add(new SP.Guid(featureId), false, SP.FeatureDefinitionScope[scope]);
        var executeContext = getExecuteContext(context);
        executeContext.executeQueryAsync(function () {
            d.resolve();
        },
        function () {
            austal.common.uiManager.log('Failed to activated web feature ' + featureId, true);
            d.reject();
        });
        return d;
    }

    //get activated features at site collection or web scope
    function getActivatedFeatures(context, isWebLevel, callback) {
        //austal.common.uiManager.log('getting activated web features');
        var deferred = $.Deferred();
        var web = context.get_web();
        var site = context.get_site();

        var executeContext = getExecuteContext(context);
        var frs = isWebLevel ? web.get_features() : site.get_features();
        var features = executeContext.loadQuery(frs, 'Include(DefinitionId)');
        executeContext.executeQueryAsync(function () {
            //austal.common.uiManager.log('Got all activated features');
            var featuresInfo = [];
            ko.utils.arrayForEach(features, function (l) {
                featuresInfo.push({ id: l.get_definitionId().toString() });
            });
            callback(featuresInfo);
            deferred.resolve(arguments);
        },
        function () {
            austal.common.uiManager.log('Failed to get all activated features', true);
            callback(null);
            deferred.reject(arguments);
        });
        return deferred;
    };
    //Convert sp-enumerator to list
    var getEnumerationList = function (source) {
        var list = [];
        var enumerator = source.getEnumerator();
        while (enumerator.moveNext()) {
            list.push(enumerator.get_current());
        }
        return list;
    }

    //convert sharepoint list to custom object - listinfo
    function convertToListInfo(l) {
        var lInfo = {
            title: l.get_title(),
            id: l.get_id().toString(),
            rootFolderUrl: l.get_rootFolder().get_serverRelativeUrl(),
            contentTypesEnabled: l.get_contentTypesEnabled(),
            parentWebUrl: l.get_parentWebUrl()

        };
        return lInfo;
    }

    //END - private functions






    //BEGING - public functions

    var createGroup = function (context, pnpGroup, roleDefinitionName, callback) {
        var d = $.Deferred();
        austal.common.uiManager.log('creating group ' + pnpGroup.Title);
        var groupCreationInfo = new SP.GroupCreationInformation();
        groupCreationInfo.set_title(pnpGroup.Title);
        groupCreationInfo.set_description(pnpGroup.Description);
        var web = context.get_web();
        var group = web.get_siteGroups().add(groupCreationInfo);
        group.set_onlyAllowMembersViewMembership(pnpGroup.OnlyAllowMembersViewMembership);
        group.set_allowMembersEditMembership(pnpGroup.AllowMembersEditMembership);
        group.set_allowRequestToJoinLeave(pnpGroup.AllowRequestToJoinLeave);
        group.set_autoAcceptRequestToJoinLeave(pnpGroup.AutoAcceptRequestToJoinLeave);
        group.update();
        var executeContext = getExecuteContext(context);

        var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(executeContext);
        if (roleDefinitionName) {
            var roleDefinition = web.get_roleDefinitions().getByName(roleDefinitionName);
            collRoleDefinitionBinding.add(roleDefinition);
            var collRollAssignment = web.get_roleAssignments();

            collRollAssignment.add(group, collRoleDefinitionBinding);
        }
        executeContext.load(group);
        executeContext.executeQueryAsync(function () {
            callback(group);
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;
    }


    var addUserToGroup = function (context, groupName, userKey) {
        var web = context.get_web();
        var group = web.get_siteGroups().getByName(groupName);
        group.get_users().addUser(web.ensureUser(userKey));
        group.update();
        return getExecuteContext(context).executeQueryPromise();
    }

    var getAllSiteGroups = function (context, callback) {
        var d = $.Deferred();
        var site = context.get_site();
        var siteGroups = site.get_rootWeb().get_siteGroups();
        var executeContext = getExecuteContext(context);
        executeContext.load(siteGroups);
        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(siteGroups));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;
    }

    var getListFields = function (context, listTitle, callback) {
        var d = $.Deferred();
        var web = context.get_web();
        var list = web.get_lists().getByTitle(listTitle);
        var listFields = list.get_fields();
        var executeContext = getExecuteContext(context);
        executeContext.load(listFields);
        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(listFields));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;
    }

    var getAllLists = function (context, callback) {
        //austal.common.uiManager.log('getting all lists');
        var deferred = $.Deferred();
        var web = context.get_web();
        var lists = web.get_lists();
        var executeContext = getExecuteContext(context);
        var listInfoArray = executeContext.loadQuery(lists, "Include(Title,Id,RootFolder,ContentTypesEnabled,ParentWebUrl)");
        executeContext.executeQueryAsync(function () {
            //austal.common.uiManager.log('Got all lists');
            var listInfo = [];
            ko.utils.arrayForEach(listInfoArray, function (l) {
                listInfo.push(convertToListInfo(l));
            });
            callback(listInfo);
            deferred.resolve();
        }, function () {
            austal.common.uiManager.log('Failed to get all lists', true);
            callback(null);
            deferred.reject();
        });
        return deferred;
    }

    var getListInfo = function (context, listTitle, callback) {
        var d = $.Deferred();
        var web = context.get_web();
        var list = web.get_lists().getByTitle(listTitle);
        var executeContext = getExecuteContext(context);
        executeContext.load(list, 'Title', 'Id', 'RootFolder', 'ContentTypesEnabled', 'ContentTypes', 'ParentWebUrl');
        executeContext.executeQueryAsync(function () {
            callback(convertToListInfo(list));
            d.resolve();
        },
            function () {
                callback(null);
                d.reject();
            });
        return d;
    };

    var activateDeactivateWebFeatures = function (context, featuresToActivate) {

        var deferred = $.Deferred();
        if (featuresToActivate == null || featuresToActivate.length == 0) {
            deferred.resolve();
            return deferred;
        }
        austal.common.uiManager.log('activating/deactivating features');


        var promises = $.when(1);//empty promise
        for (var i = 0; i < featuresToActivate.length; i++) {
            (function (f) {
                promises = promises.then(function () {
                    return activateWebFeature(context, f.Id, f.Scope ? f.Scope : 'farm');//if no scope is provided, it's farm scoped
                });

            })(featuresToActivate[i]);
        }
        promises.done(function () {
            austal.common.uiManager.log('Activated all features');
            deferred.resolve();
        }).fail(function () {
            austal.common.uiManager.log('Failed to activated all features', true);
            deferred.reject();
        });

        return deferred;
    };


    var createList = function (context, pnpList) {
        var promises = $.when(1);
        var title = pnpList.Title;
        var description = pnpList.Description;
        var url = pnpList.Url;
        var template = pnpList.TemplateType;
        var onQuickLaunch = pnpList.OnQuickLaunch;
        var list;
        var web = context.get_web();
        var allLists = null;
        var executeContext = getExecuteContext(context);
        promises = promises.then(function () {
            return getAllLists(context, function (lsts) {
                allLists = lsts;
            });
        });

        promises = promises.then(function () {
            var existingList = ko.utils.arrayFirst(allLists, function (l) {
                return l.title.toLowerCase() == pnpList.Title.toLowerCase();
            });
            if (existingList) {
                list = existingList;
                return {};
            }

            austal.common.uiManager.log('creating list ' + title);
            var listCreationInfo = new SP.ListCreationInformation();
            listCreationInfo.set_title(title);
            listCreationInfo.set_description(description);
            listCreationInfo.set_url(url);
            listCreationInfo.set_templateType(template);
            list = web.get_lists().add(listCreationInfo);
            return executeContext.executeQueryPromise();
        });

        promises = promises.then(function () {
            austal.common.uiManager.log('updating list {0} '.format(title));
            var updateListRequired = false;
            list = web.get_lists().getByTitle(title);
            if (onQuickLaunch != null) {
                list.set_onQuickLaunch(onQuickLaunch ? SP.QuickLaunchOptions.on : SP.QuickLaunchOptions.off);
            }
            if (pnpList.EnableVersioning != null) {
                list.set_enableVersioning(pnpList.EnableVersioning);
                if (pnpList.EnableVersioning)
                    list.set_majorVersionLimit(pnpList.MaxVersionLimit);
            }
            if (pnpList.EnableMinorVersions != null) {
                list.set_enableMinorVersions(pnpList.EnableMinorVersions);
                if (pnpList.EnableMinorVersions) {
                    list.set_draftVersionVisibility(SP.DraftVisibilityType.author);
                    list.set_majorWithMinorVersionsLimit(pnpList.MinorVersionLimit);
                }
            }
            if (pnpList.EnableModeration != null) {
                list.set_enableModeration(pnpList.EnableModeration);
            }
            if (pnpList.ForceCheckOut != null) {
                list.set_forceCheckout(pnpList.ForceCheckOut);
            }


            if (pnpList.EnableAttachments != null) {
                list.set_enableAttachments(pnpList.EnableAttachments);
            }
            if (pnpList.Hidden != null) {
                list.set_hidden(pnpList.Hidden);
            }
            if (pnpList.EnableFolderCreation != null) {
                list.set_enableFolderCreation(pnpList.EnableFolderCreation);
            }
            updateListRequired = pnpList.OnQuickLaunch != null || pnpList.EnableVersioning != null ||
                pnpList.EnableMinorVersions != null || pnpList.EnableModeration != null || pnpList.ForceCheckOut != null
                || pnpList.EnableAttachments != null || pnpList.Hidden != null || pnpList.EnableFolderCreation != null;
            if (updateListRequired) {
                list.update();
                return executeContext.executeQueryPromise();
            }
            return {};
        });



        return promises;
    }


    var createViews = function (context, pnpListInstance) {
        if (pnpListInstance.Views == null || pnpListInstance.Views.length == 0) return {};
        var web = context.get_web();
        var executeContext = getExecuteContext(context);
        var existingViews = null;
        var listInstance;

        var promises = $.when(1);
        promises = promises.then(function () {
            listInstance = web.get_lists().getByTitle(pnpListInstance.Title);
            existingViews = listInstance.get_views();
            executeContext.load(existingViews);
            executeContext.load(listInstance);
            return executeContext.executeQueryPromise();
        });

        promises = promises.then(function () {
            if (!pnpListInstance.RemoveExistingViews) return {};
            existingViews = getEnumerationList(existingViews);
            for (var i = 0; i < existingViews.length; i++) {
                existingViews[i].deleteObject();
            }
            return executeContext.executeQueryPromise();
        });

        for (var j = 0; j < pnpListInstance.Views.length; j++) {
            (function (pnpView) {
                promises = promises.then(function () {
                    var listViewCreationInfo = new SP.ViewCreationInformation();
                    listViewCreationInfo.set_title(pnpView.DisplayName);
                    listViewCreationInfo.set_rowLimit(pnpView.RowLimit ? pnpView.RowLimit : 30);
                    listViewCreationInfo.set_viewTypeKind(SP.ViewType.html); //for now set html.
                    listViewCreationInfo.set_setAsDefaultView(pnpView.DefaultView);
                    listViewCreationInfo.set_paged(pnpView.Paged);
                    listViewCreationInfo.set_query(pnpView.Query);
                    listViewCreationInfo.set_viewFields(pnpView.ViewFields);
                    listInstance.get_views().add(listViewCreationInfo);
                    return executeContext.executeQueryPromise();
                });
            })(pnpListInstance.Views[j]);
        }

        return promises;
    }

    var getListContentTypes = function (context, listIdOrTitle, propertiesToLoad, callback) {
        var d = $.Deferred();
        var executeContext = getExecuteContext(context);
        var web = context.get_web();
        var list = austal.utils.isGuid(listIdOrTitle) ? web.get_lists().getById(listIdOrTitle) : web.get_lists().getByTitle(listIdOrTitle);
        var conteTypes = list.get_contentTypes();
        if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
            propertiesToLoad = "Include({0})".format(propertiesToLoad);
        }
        if (propertiesToLoad)
            executeContext.load(conteTypes, propertiesToLoad);
        else
            executeContext.load(conteTypes);
        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(conteTypes));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;

    }
    var addContentTypeToList = function (context, listId, contentTypeBinding) {
        var contentTypeName = contentTypeBinding.Name;
        var executeContext = getExecuteContext(context);
        var web = context.get_web();
        var promises = $.when(1);

        var webContentType = null;
        var listContentType = null;
        var listContentTypeFields = null;
        var listContentTypes = null;
        var list = null;
        promises = promises.then(function () {
            return getWebContentTypeByName(context, contentTypeName, 'Id,Name', function (ct) {
                webContentType = ct;
            });
        });
        promises = promises.then(function () {
            return getListContentTypes(context, listId, 'Id,Name', function (cts) {
                listContentTypes = cts;
            });
        });
        promises = promises.then(function () {
            listContentType = ko.utils.arrayFirst(listContentTypes, function (lct) {
                return lct.get_name() == contentTypeName;
            });


            list = web.get_lists().getById(listId);

            if (listContentType == null) {
                var lContentTypes = list.get_contentTypes();
                webContentType = web.get_availableContentTypes().getById(webContentType.get_id());
                listContentType = lContentTypes.addExistingContentType(webContentType);
            }
            listContentTypeFields = listContentType.get_fields();
            executeContext.load(listContentType);
            executeContext.load(listContentTypeFields);
            executeContext.load(list);
            return executeContext.executeQueryPromise();
        });
        promises = promises.then(function () {
            if (contentTypeBinding.Hidden) {
                var ct = list.get_contentTypes().getById(listContentType.get_id());
                ct.set_hidden(true);
                ct.update();
                return executeContext.executeQueryPromise();
            }
            return {};
        });

        promises = promises.then(function () {
            var iPromies = $.when(1);
            var d = $.Deferred();
            listContentTypeFields = getEnumerationList(listContentTypeFields);

            //Rich text field in document library gets converted to plain text. This code snippet will make sure the field is converted back to rich text 
            //after adding the content type. Ref - https://social.msdn.microsoft.com/Forums/office/en-US/95a05ae0-5d3b-432f-81bf-1f4a03e9910b/rich-text-column-in-document-library?forum=sharepointcustomizationlegacy
            if (list.get_baseTemplate() == SP.ListTemplateType.documentLibrary) {
                //if the content type inherits from document, then check if there's any rich text field that needs conversion from plain text to rich text
                var noteFields = ko.utils.arrayFilter(listContentTypeFields, function (f) {
                    return f.get_typeAsString() == 'Note' && executeContext.castTo(f, SP.FieldMultiLineText).get_richText() == false;
                });

                for (var i = 0; i < noteFields.length; i++) {
                    (function (nf) {
                        var webField;
                        iPromies = iPromies.then(function () {
                            webField = web.get_availableFields().getById(nf.get_id());
                            executeContext.load(webField);
                            return executeContext.executeQueryPromise();
                        });
                        iPromies = iPromies.then(function () {
                            var richTextField = context.castTo(webField, SP.FieldMultiLineText);
                            if (richTextField.get_richText()) {
                                var lf = context.castTo(nf, SP.FieldMultiLineText);
                                lf.set_richText(true);
                                lf.update();
                                return executeContext.executeQueryPromise();
                            }
                            return {};
                        });


                    })(noteFields[i]);
                }

            }

            iPromies.then(function () {
                d.resolve();
            }, function () {
                d.reject();
            });
            return d;

        });

        return promises;
    };

    var enableListContentType = function (context, listId) {
        var web = context.get_web();
        var list = web.get_lists().getById(listId);
        list.set_contentTypesEnabled(true);
        list.update();
        return getExecuteContext(context).executeQueryPromise();
    };

    var createWebField = function (context, webServerRelativeUrl, pnpField) {
        var promises = $.when(1);
        var web = context.get_web();
        var executeContext = getExecuteContext(context);
        var lists = null;

        var idPart = pnpField.ID == null ? "" : "ID='" + pnpField.ID + "'";
        var requiredPart = pnpField.Required ? " Required='TRUE' " : " Required='FALSE' ";
        var jsLinkPart = pnpField.JSLink ? " JSLink='{0}' ".format(pnpField.JSLink) : "";
        var xml = "<Field " + idPart + " Name='" + pnpField.Name + "' DisplayName='" + pnpField.DisplayName + "' Type='" + pnpField.Type + "' " + requiredPart + jsLinkPart + " Group='" + pnpField.Group + "' />";
        var fieldCreated;

        promises = promises.then(function () {
            executeContext.load(web, 'ServerRelativeUrl');
            fieldCreated = web.get_fields().addFieldAsXml(xml, true, SP.AddFieldOptions.addFieldCheckDisplayName);
            executeContext.load(fieldCreated);
            return executeContext.executeQueryPromise();
        });



        if (pnpField.Type == 'Lookup' || pnpField.Type == 'LookupMulti') {
            promises = promises.then(function () {
                return getAllLists(context, function (lsts) {
                    lists = lsts;
                });
            });
            promises = promises.then(function () {
                var listUrl = (webServerRelativeUrl + '/' + pnpField.List).toLowerCase();
                var list = ko.utils.arrayFirst(lists, function (l) {
                    return l.rootFolderUrl.toLowerCase() == listUrl;
                });

                var fieldLookup = executeContext.castTo(fieldCreated, SP.FieldLookup);
                fieldLookup.set_lookupList(list.id);
                fieldLookup.set_lookupField(pnpField.ShowField);
                fieldLookup.set_allowMultipleValues(pnpField.Type == 'LookupMulti');
                fieldLookup.update();

                return executeContext.executeQueryPromise();

            });
            if (pnpField.DependentLookupFields) {
                promises = promises.then(function () {
                    var fieldLookup = executeContext.castTo(fieldCreated, SP.FieldLookup);
                    for (var i = 0; i < pnpField.DependentLookupFields.length; i++) {
                        web.get_fields().addDependentLookup(pnpField.DependentLookupFields[i].DisplayName, fieldLookup, pnpField.DependentLookupFields[i].ShowField);
                    }
                    return executeContext.executeQueryPromise();
                });
            }
        }
        return promises;
    }

    var createWebContentType = function (context, pnpContentType) {
        var promises = $.when(1);
        var webContentTypes;
        var ctParentId = pnpContentType.ParentID;
        var ctName = pnpContentType.Name;
        var ctGroup = pnpContentType.Group;
        var ctDescription = pnpContentType.Description;
        var fieldRefs = pnpContentType.FieldRefs;
        var docSetTemplate = pnpContentType.DocumentSetTemplate;
        var executeContext = getExecuteContext(context);
        var contentTypeCreated = null;
        var fieldLinks;
        promises = promises.then(function () {
            var web = context.get_web();
            webContentTypes = web.get_contentTypes();
            var parentContentType = context.get_site().get_rootWeb().get_availableContentTypes().getById(ctParentId);//considering parent content type is always from root web

            var ctCreationInformation = new SP.ContentTypeCreationInformation();
            ctCreationInformation.set_name(ctName);
            ctCreationInformation.set_group(ctGroup);
            ctCreationInformation.set_description(ctDescription);
            ctCreationInformation.set_parentContentType(parentContentType);
            contentTypeCreated = webContentTypes.add(ctCreationInformation);
            fieldLinks = contentTypeCreated.get_fieldLinks();


            executeContext.load(contentTypeCreated);
            executeContext.load(fieldLinks, 'Include(Id,Name,Hidden)');
            return executeContext.executeQueryPromise();
        });
        promises = promises.then(function () {
            fieldLinks = getEnumerationList(fieldLinks);
        });

        if (fieldRefs != null && fieldRefs.length > 0) {
            for (var i = 0; i < fieldRefs.length; i++) {
                (function (fr) {
                    promises = promises.then(function () {
                        contentTypeCreated = context.get_web().get_contentTypes().getById(contentTypeCreated.get_id());
                    });

                    promises = promises.then(function () {
                        var fieldExists = ko.utils.arrayFirst(fieldLinks, function (fl) {
                            var fieldRefId = new SP.Guid(fr.ID);
                            return fl.get_id().equals(fieldRefId);
                        }) != null;

                        var fieldLink;
                        if (fieldExists) {
                            fieldLink = contentTypeCreated.get_fieldLinks().getById(fr.ID);
                        } else {
                            var fieldLinkCreationInfo = new SP.FieldLinkCreationInformation();
                            var field = context.get_web().get_availableFields().getByInternalNameOrTitle(fr.Name);
                            fieldLinkCreationInfo.set_field(field);
                            fieldLink = contentTypeCreated.get_fieldLinks().add(fieldLinkCreationInfo);
                        }

                        if (fr.Hidden != null) {
                            fieldLink.set_hidden(fr.Hidden);
                        }
                        if (fr.Required != null)
                            fieldLink.set_required(fr.Required);

                    });

                    promises = promises.then(function () {
                        contentTypeCreated.update(true);
                        executeContext.load(contentTypeCreated);
                        return executeContext.executeQueryPromise();

                    });

                })(fieldRefs[i]);
            }
        }
        promises = promises.then(function () {
            var reorderedFields = ko.utils.arrayMap(fieldRefs, function (f) {
                return f.Name;
            });
            var fieldLinks = contentTypeCreated.get_fieldLinks();
            fieldLinks.reorder(reorderedFields);
            contentTypeCreated.update(true);
            executeContext.load(contentTypeCreated);
            return executeContext.executeQueryPromise();

        });

        if (docSetTemplate) //document set id
        {
            promises = promises.then(function () {
                return provisionDocumentSet(context, docSetTemplate, contentTypeCreated);
            });

        }

        return promises;


    };
    function provisionDocumentSet(context, pnpDocSetTemplate, contentType) {
        var promises = $.when(1);
        var dsTemplate;
        var welcomeFieldsResponse, allowedContentTypesResponse, sharedFieldsResponse;
        var executeContext = getExecuteContext(context);
        var web = context.get_web();
        var webAvailableContentTypes;
        promises = promises.then(function () {

            dsTemplate = SP.DocumentSet.DocumentSetTemplate.getDocumentSetTemplate(executeContext, contentType);
            welcomeFieldsResponse = dsTemplate.get_welcomePageFields();
            allowedContentTypesResponse = dsTemplate.get_allowedContentTypes();
            sharedFieldsResponse = dsTemplate.get_sharedFields();
            webAvailableContentTypes = web.get_availableContentTypes();
            executeContext.load(dsTemplate);
            executeContext.load(welcomeFieldsResponse);
            executeContext.load(allowedContentTypesResponse);
            executeContext.load(sharedFieldsResponse);
            executeContext.load(webAvailableContentTypes, 'Include(Id,Name)');
            return executeContext.executeQueryPromise();
        });
        promises = promises.then(function () {
            var dsAllowedContentTypes = getEnumerationList(allowedContentTypesResponse);
            webAvailableContentTypes = getEnumerationList(webAvailableContentTypes);

            //add contnet types
            for (var i = 0; i < pnpDocSetTemplate.AllowedContentTypes.length; i++) {
                var pnpAllowedCT = pnpDocSetTemplate.AllowedContentTypes[i];
                var ctDefinition = ko.utils.arrayFirst(webAvailableContentTypes, function (ct) {
                    return ct.get_name() == pnpAllowedCT.Name;
                });
                var ctExistsInDocumentSet = ko.utils.arrayFirst(dsAllowedContentTypes, function (act) { //check if content type already exists in document set
                    return act.get_stringValue().toLowerCase() == ctDefinition.get_id().get_stringValue().toLowerCase();
                }) != null;
                if (!ctExistsInDocumentSet) {
                    dsTemplate.get_allowedContentTypes().add(ctDefinition.get_id());
                }
            }

            //remove content types not needed
            for (var a = 0; a < dsAllowedContentTypes.length; a++) {
                var dsAllowedContentType = dsAllowedContentTypes[a];
                var ctDefinition = ko.utils.arrayFirst(webAvailableContentTypes, function (ct) {
                    return ct.get_id().get_stringValue().toLowerCase() == dsAllowedContentType.get_stringValue().toLowerCase();
                });

                var removeCT = ko.utils.arrayFirst(pnpDocSetTemplate.AllowedContentTypes, function (ct) { //check if content type is allowed in document set
                    return ct.Name == ctDefinition.get_name();
                }) == null;
                if (removeCT) {
                    dsTemplate.get_allowedContentTypes().remove(ctDefinition.get_id());
                }
            }


            //add shared fields
            var dsSharedFields = getEnumerationList(sharedFieldsResponse);
            for (var j = 0; j < pnpDocSetTemplate.SharedFields.length; j++) {
                var sField = pnpDocSetTemplate.SharedFields[j];
                var field = web.get_availableFields().getByInternalNameOrTitle(sField.Name);
                var fieldExists = ko.utils.arrayFirst(dsSharedFields, function (sf) {
                    return sf.get_internalName() == sField.Name;
                }) != null;
                if (!fieldExists)
                    dsTemplate.get_sharedFields().add(field);
            }

            var dsWelcomePageFields = getEnumerationList(welcomeFieldsResponse);
            for (var k = 0; k < pnpDocSetTemplate.WelcomePageFields.length; k++) {
                var wField = pnpDocSetTemplate.WelcomePageFields[k];
                var wfExists = ko.utils.arrayFirst(dsWelcomePageFields, function (f) {
                    return f.get_internalName() == wField.Name;
                }) != null;
                if (!wfExists) {
                    var field = web.get_availableFields().getByInternalNameOrTitle(wField.Name);
                    dsTemplate.get_welcomePageFields().add(field);
                }
            }
            dsTemplate.update(true);
            return executeContext.executeQueryPromise();
        });
        return promises;
    }
    var removeAllContentTypesBut = function (context, listTitle, pnpContentTypeBindings, pnpDeafultContentType) {
        var promises = $.when(1);
        var listContentTypesObj = null;
        var rootFolder = null;
        var executeContext = getExecuteContext(context);
        //get list content types
        promises = promises.then(function () {
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listTitle);
            rootFolder = list.get_rootFolder();
            listContentTypesObj = list.get_contentTypes();
            executeContext.load(listContentTypesObj);
            executeContext.load(rootFolder);
            return executeContext.executeQueryPromise();
        });


        //set default content type
        promises = promises.then(function () {
            var web = context.get_web();
            var listContentTypes = getEnumerationList(listContentTypesObj);

            var reorderedListContentTypes = [];
            var defaultContentType = ko.utils.arrayFirst(listContentTypes, function (ct) {
                return ct.get_name() == pnpDeafultContentType.Name;
            });
            reorderedListContentTypes.push(defaultContentType.get_id());
            var nonDefaultContentTypes = ko.utils.arrayFilter(listContentTypes, function (ct) {
                return ct.get_name() != pnpDeafultContentType.Name && !ct.get_stringId().startsWith(austal.common.constants.folderContentTypeId);//ignore folder
            });
            ko.utils.arrayForEach(nonDefaultContentTypes, function (ct) {
                reorderedListContentTypes.push(ct.get_id());
            });

            rootFolder.set_uniqueContentTypeOrder(reorderedListContentTypes);
            rootFolder.update();

            var list = web.get_lists().getByTitle(listTitle);
            rootFolder = list.get_rootFolder();
            listContentTypesObj = list.get_contentTypes();
            executeContext.load(listContentTypesObj);
            executeContext.load(rootFolder);

            return executeContext.executeQueryPromise();
        });

        //delete other content types
        promises = promises.then(function () {
            var listContentTypes = getEnumerationList(listContentTypesObj);

            var contentTypesToDelete = ko.utils.arrayFilter(listContentTypes, function (lct) {
                return ko.utils.arrayFirst(pnpContentTypeBindings, function (ctb) {
                    return ctb.Name == lct.get_name();
                }) == null;
            });
            contentTypesToDelete = ko.utils.arrayFilter(contentTypesToDelete, function (ctb) {//exclude folders
                return !ctb.get_stringId().startsWith('0x012000');
            });

            ko.utils.arrayForEach(contentTypesToDelete, function (ct) {
                ct.deleteObject();
            });
            return executeContext.executeQueryPromise();
        });

        return promises;
    };
    var addEnterpriseKeywordColumnsToList = function (context, listTitle) {
        var promises = $.when(1);
        var executeContext = getExecuteContext(context);

        promises = promises.then(function () {
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listTitle);
            var taxKeywordField = context.get_site().get_rootWeb().get_fields().getByInternalNameOrTitle('TaxKeyword');

            list.get_fields().add(taxKeywordField);
            return executeContext.executeQueryPromise();
        });
        var contentTypes = null;
        var contentTypeList = [];
        promises = promises.then(function () {
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listTitle);
            //var taxKeywordField = list.get_fields().getByInternalNameOrTitle('TaxKeyword');
            contentTypes = list.get_contentTypes();
            contentTypeList = executeContext.loadQuery(contentTypes, 'Include(StringId,Id,Name,Fields)');
            return executeContext.executeQueryPromise();

        });
        promises = promises.then(function () {
            var d = $.Deferred();
            var iPromises = $.when(1);
            for (var i = 0; i < contentTypeList.length; i++) {
                if (contentTypeList[i].get_stringId().startsWith(austal.common.constants.folderContentTypeId))//no need to process folders
                    continue;
                var fields = getEnumerationList(contentTypeList[i].get_fields());
                var fieldExistsInContentType = ko.utils.arrayFirst(fields, function (f) {
                    return f.get_internalName() == 'TaxKeyword';
                }) != null;
                if (!fieldExistsInContentType) {
                    (function (ct) {
                        iPromises = iPromises.then(function () {
                            return addExistingFieldToListContentType(context, listTitle, ct.get_id(), 'TaxKeyword');
                        });
                    })(contentTypeList[i]);
                }
            }
            iPromises.then(function () {
                d.resolve();
            }, function () {
                d.reject();
            });
            return d;
        });

        return promises;
    }
    ///updated list field's display name
    var updateListField = function (context, listTitle, fId, fDisplayName) {
        var web = context.get_web();
        var listField = web.get_lists().getByTitle(listTitle).get_fields().getById(fId);
        listField.set_title(fDisplayName);
        listField.update();
        return getExecuteContext(context).executeQueryPromise();
    }
    //update field choices
    var updateListFieldChoices = function (context, listTitle, fId, choices) {
        var executeContext = getExecuteContext(context);
        var web = context.get_web();
        var listField = web.get_lists().getByTitle(listTitle).get_fields().getById(fId);
        var choiceField = executeContext.castTo(listField, SP.FieldChoice);
        choiceField.set_choices(choices);
        choiceField.updateAndPushChanges();
        return executeContext.executeQueryPromise();

    }
    var addFieldToList = function (context, listTitle, fId, fDisplayName) {
        var promises = $.when(1);
        var webField;
        var executeContext = getExecuteContext(context);
        promises = promises.then(function () {
            var web = context.get_web();
            var list = web.get_lists().getByTitle(listTitle);
            webField = web.get_availableFields().getById(fId);
            executeContext.load(webField);
            list.get_fields().add(webField);
            return executeContext.executeQueryPromise();
        });

        promises = promises.then(function () {
            if (webField.get_title() == fDisplayName) return {};//display name same so return empty promise;
            return updateListField(context, listTitle, fId, fDisplayName);
        });

        return promises;
    }

    var getAvailableFields = function (context, propertiesToLoad, callback) {
        var d = $.Deferred();
        var executeContext = getExecuteContext(context);
        var web = context.get_web();
        var fields = web.get_availableFields();

        if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
            propertiesToLoad = "Include({0})".format(propertiesToLoad);
        }
        if (propertiesToLoad)
            executeContext.load(fields, propertiesToLoad);
        else
            executeContext.load(fields);
        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(fields));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;

    }
    var getAvailableContentTypes = function (context, propertiesToLoad, callback) {
        var d = $.Deferred();
        var executeContext = getExecuteContext(context);
        var web = context.get_web();

        var availableContentTypes = web.get_availableContentTypes();

        if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
            propertiesToLoad = "Include({0})".format(propertiesToLoad);
        }
        if (propertiesToLoad)
            executeContext.load(availableContentTypes, propertiesToLoad);
        else
            executeContext.load(availableContentTypes);
        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(availableContentTypes));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;
    }


    var getCurrentUser = function (context, callback) {
        var d = $.Deferred();
        var user = context.get_site().get_rootWeb().get_currentUser();
        context.load(user);
        context.executeQueryAsync(function () {
            callback(user);
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;
    }

    var getAllwebs = function (context, properties, callback) {
        var d = $.Deferred();
        var site = context.get_site();
        var allWebs = site.get_rootWeb().get_webs();
        var executeContext = getExecuteContext(context);
        if (!properties.startsWith('Include(')) {
            properties = "Include({0})".format(properties);
        }
        executeContext.load(allWebs, properties);
        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(allWebs));
            d.resolve();
        }, function () {
            d.reject();
        });
        return d;
    }
    var getFilesInfo = function (context, docLibTitle, callback) {
        var d = $.Deferred();
        var web = context.get_web();
        var docLib = web.get_lists().getByTitle(docLibTitle);
        var files = docLib.get_rootFolder().get_files();
        var executeContext = getExecuteContext(context);
        executeContext.load(files);
        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(files));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;
    }
    var getFileContent = function (webUrl, fileServerRelativeUrl, callback) {
        var url = webUrl + "/_api/web/getfilebyserverrelativeurl('" + fileServerRelativeUrl + "')/$value";
        var options = {
            url: url,
            method: 'GET',
            'cache': false,
            headers: {
                "Content-Type": "application/json; odata=verbose",
                "Accept": "application/json; odata=verbose"
            },
            dataType: 'text',
            success: callback,
            error: function () {
                callback(null);
            }
        }
        return $.ajax(options);
    }

    var getFileContentAsBinary = function (siteUrl, fileServerRelativeUrl, callback) {
        var d = $.Deferred();
        var url;
        if (austal.common.contextInfo.isAppWeb && !siteUrl.toLowerCase().startsWith(_spPageContextInfo.webAbsoluteUrl.toLowerCase())) {
            url = "{0}/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('{1}')/$value?@target='{2}'"
                .format(_spPageContextInfo.webAbsoluteUrl, fileServerRelativeUrl, siteUrl);
        } else
            url = "{0}/_api/web/GetFileByServerRelativeUrl('{1}')/$value".format(siteUrl, fileServerRelativeUrl);
        var re = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
        re.executeAsync({
            url: url,
            method: "GET",
            headers: {
                "accept": "application/json; odata=verbose"
            },
            binaryStringResponseBody: true,
            success: function (c) {
                callback(c.body);
                d.resolve();
            },
            error: function () {
                callback(null);
                d.reject();
            }
        });
        return d;
    }


    var getListItems = function (context, listTitle, maxCount, fieldsToLoad, callback) {
        var d = $.Deferred();
        var list = context.get_web().get_lists().getByTitle(listTitle);
        var camlQuery = new SP.CamlQuery();
        if (maxCount == 0) {
            maxCount = 10000;//sorry we support max 10,000;
        }
        camlQuery.set_viewXml("<View Scope='RecursiveAll'><Query></Query><RowLimit>{0}</RowLimit></View>".format(maxCount));
        var listItems = list.getItems(camlQuery);
        var executeContext = getExecuteContext(context);
        if (fieldsToLoad != null && fieldsToLoad != '')
            executeContext.load(listItems, 'Include({0})'.format(fieldsToLoad));

        else
            executeContext.load(listItems);
        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(listItems));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;
    }

    var getListItemsbyIds = function (context, listIdOrTitle, itemIds, fieldsToLoad, callback) {
        var web = context.get_web();
        var executeContext = getExecuteContext(context);
        var d = $.Deferred();
        var query = "<View Scope='RecursiveAll'><Query><Where><In><FieldRef Name='ID' /><Values>{0}</Values></In></Where></Query></View>";
        var valuesQueryPart = "";
        for (var i = 0; i < itemIds.length; i++) {
            valuesQueryPart += "<Value Type='Counter'>{0}</Value>".format(itemIds[i]);
        }
        query = query.format(valuesQueryPart);
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(query);
        var list = austal.utils.isGuid(listIdOrTitle) ? web.get_lists().getById(listIdOrTitle) : web.get_lists().getByTitle(listIdOrTitle);
        var listItems = list.getItems(camlQuery);
        if (fieldsToLoad != null && fieldsToLoad != '')
            executeContext.load(listItems, 'Include({0})'.format(fieldsToLoad));
        else
            executeContext.load(listItems);

        executeContext.executeQueryAsync(function () {
            callback(getEnumerationList(listItems));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();
        });
        return d;
    }

    function getCustomActionXmlNode(xml) {
        var actionxml = $.parseXML(xml);
        var ca = $(actionxml).find('CustomAction');
        return ca;
    }
    var addCustomAction = function (context, webUrl, fileServerRelativeUrl) {
        var executeContext = getExecuteContext(context);
        var promises = $.when(1);
        var ribbonXml = null;
        var customActions = null;
        var customActionNodes;
        //var customActionName;
        promises = promises.then(function () {
            return getFileContent(webUrl, fileServerRelativeUrl, function (xml) {
                ribbonXml = xml;
                customActionNodes = getCustomActionXmlNode(ribbonXml);
                //customActionName = $(customActionNode).attr('Id');
            });
        });

        promises = promises.then(function () {
            var web = context.get_web();
            customActions = web.get_userCustomActions();
            executeContext.load(customActions);
            return executeContext.executeQueryPromise();
        });
        promises = promises.then(function () {
            var actions = getEnumerationList(customActions);
            for (var i = 0; i < customActionNodes.length; i++) {
                var customActionName = $(customActionNodes[i]).attr('Id');
                var existingAction = ko.utils.arrayFirst(actions, function (a) {
                    return a.get_name() == customActionName;
                });
                if (existingAction) {
                    existingAction.deleteObject();
                }
            }
            return executeContext.executeQueryPromise();
        });


        promises = promises.then(function () {
            var d = $.Deferred();
            var iPromies = $.when(1);
            for (var i = 0; i < customActionNodes.length; i++) {
                (function (customActionNode) {
                    iPromies = iPromies.then(function () {
                        var customActionName = $(customActionNode).attr('Id');
                        var xmlContent = null, url = null, registrationType = null;
                        var cmdExtension = $(customActionNode).find('CommandUIExtension');
                        var urlAction = $(customActionNode).find('UrlAction');
                        var location = $(customActionNode).attr('Location');
                        var registrationId = $(customActionNode).attr('RegistrationId');
                        var groupId = $(customActionNode).attr('GroupId');
                        var rights = $(customActionNode).attr('Rights');

                        if (urlAction && urlAction.length > 0) {
                            url = $(customActionNode).find('UrlAction').attr('Url');
                        } else {
                            if (window.XMLSerializer) {//jQuery parsing in IE doesn't work so need to use window.XMLSerializer for IE
                                xmlContent = new window.XMLSerializer().serializeToString($(cmdExtension).get(0));
                            } else {
                                xmlContent = $(customActionNode).find('CommandUIExtension')[0].outerHTML;
                            }
                        }

                        if ($(customActionNode).attr('RegistrationType') != null) {
                            switch ($(customActionNode).attr('RegistrationType')) {
                                case 'List':
                                    registrationType = SP.UserCustomActionRegistrationType.list;
                                    break;
                                case 'ContentType':
                                    registrationType = SP.UserCustomActionRegistrationType.contentType;
                                    break;
                                case 'FileType':
                                    registrationType = SP.UserCustomActionRegistrationType.fileType;
                                    break;
                                case 'ProgId':
                                    registrationType = SP.UserCustomActionRegistrationType.progId;
                                    break;
                            }

                        }
                        var sequence = $(customActionNode).attr('Sequence');

                        var web = context.get_web();
                        var customAction = web.get_userCustomActions().add();
                        customAction.set_name(customActionName);

                        customAction.set_title($(customActionNode).attr('Title'));
                        customAction.set_location(location);

                        if (groupId)
                            customAction.set_group(groupId);

                        if (rights) {
                            var basePermission = new SP.BasePermissions();
                            for (var v in SP.PermissionKind) {
                                if (SP.PermissionKind.hasOwnProperty(v) && v.toLowerCase() == rights.toLowerCase()) {
                                    basePermission.set(SP.PermissionKind[v]);
                                    break;
                                }
                            }
                            customAction.set_rights(basePermission);
                        }


                        if (xmlContent)
                            customAction.set_commandUIExtension(xmlContent); // CommandUIExtension xml
                        if (registrationId)
                            customAction.set_registrationId(registrationId);
                        if (registrationType)
                            customAction.set_registrationType(registrationType);
                        if (url)
                            customAction.set_url(url);
                        customAction.set_sequence(sequence);

                        customAction.update();
                        return executeContext.executeQueryPromise();
                    });

                })(customActionNodes[i]);
            }

            iPromies.done(function () {
                d.resolve();
            })
                .fail(function () {
                    d.reject();
                });

            return d;

        });

        return promises;
    }
    var addWorkflowSubscription = function (context, pnpWFSubscription) {

        var promises = $.when(1);
        var allLists;
        var historyList, taskList;
        var historyListId, taskListId, targetListId;
        var web = context.get_web();
        var executeContext = getExecuteContext(context);
        promises = promises.then(function () {

            return getAllLists(context, function (lsts) {
                allLists = lsts;
            });
        });
        promises = promises.then(function () {
            historyList = ko.utils.arrayFirst(allLists, function (l) {
                return l.title.toLowerCase() == pnpWFSubscription.HistoryList.toLowerCase();
            });
            taskList = ko.utils.arrayFirst(allLists, function (l) {
                return l.title.toLowerCase() == pnpWFSubscription.TaskList.toLowerCase();
            });
            var targetList = pnpWFSubscription.ListTitle == null ? null : ko.utils.arrayFirst(allLists, function (l) {
                return l.title.toLowerCase() == pnpWFSubscription.ListTitle.toLowerCase();
            });
            if (targetList) {
                targetListId = targetList.get_id ? targetList.get_id().toString() : targetList.id;
            }
            return {};
        });

        promises = promises.then(function () {
            var listCreated = false;
            if (historyList == null) {
                var listCreationInformation = new SP.ListCreationInformation();
                listCreationInformation.set_templateType(SP.ListTemplateType.workflowHistory);
                listCreationInformation.set_title(pnpWFSubscription.HistoryList);
                historyList = web.get_lists().add(listCreationInformation);
                executeContext.load(historyList);
                listCreated = true;
            }
            if (taskList == null) {
                var listCreationInformation = new SP.ListCreationInformation();
                listCreationInformation.set_templateType(SP.ListTemplateType.tasks);
                listCreationInformation.set_title(pnpWFSubscription.TaskList);
                taskList = web.get_lists().add(listCreationInformation);
                executeContext.load(taskList);
                listCreated = true;
            }
            if (listCreated) {
                return executeContext.executeQueryPromise();
            }
            else return {
            };
        });

        promises = promises.then(function () {
            taskListId = taskList.get_id ? taskList.get_id().toString() : taskList.id;
            historyListId = historyList.get_id ? historyList.get_id().toString() : historyList.id;
            return publishWorkflowSubscription(context, pnpWFSubscription, taskListId, historyListId, targetListId);
        });

        return promises;
    }


    function publishWorkflowSubscription(context, pnpWFSubscription, taskListId, historyListId, targetListId) {
        var executeContext = getExecuteContext(context);
        var web = context.get_web();
        var wfSubscriptions, wfServiceManager, wfSubscriptionService;
        var promises = $.when(1);
        var subscriptionExists = false;

        promises = promises.then(function () {
            var d = $.Deferred();
            austal.utils.loadWFScripts(function () {
                wfServiceManager = new SP.WorkflowServices.WorkflowServicesManager(executeContext, web);
                wfSubscriptionService = wfServiceManager.getWorkflowSubscriptionService();
                d.resolve();
            });
            return d;
        });
        promises = promises.then(function () {
            if (targetListId == null) {
                wfSubscriptions = wfSubscriptionService.enumerateSubscriptionsByDefinition(pnpWFSubscription.DefinitionId);
                executeContext.load(wfSubscriptions);
                return executeContext.executeQueryPromise();
            }
            return {};
        });

        promises = promises.then(function () {
            if (targetListId == null) {
                wfSubscriptions = getEnumerationList(wfSubscriptions);
                subscriptionExists = ko.utils.arrayFirst(wfSubscriptions, function (s) {
                    return s.get_name() == pnpWFSubscription.Name;
                }) != null;

                //if (wfSubscription) {
                //    wfSubscriptionService.deleteSubscription(wfSubscription.get_id());
                //    executeContext.load(web);
                //    return executeContext.executeQueryPromise();
                //}
            }
            return {};
        });

        promises = promises.then(function () {
            if (subscriptionExists) {
                austal.common.uiManager.log('workflow subscription {0} exists.'.format(pnpWFSubscription.Name));
                return {};
            }

            var wfSubscription = new SP.WorkflowServices.WorkflowSubscription(executeContext);
            wfSubscription.set_definitionId(pnpWFSubscription.DefinitionId);
            wfSubscription.set_name(pnpWFSubscription.Name);


            if (pnpWFSubscription.Enabled != null)
                wfSubscription.set_enabled(pnpWFSubscription.Enabled);

            var eventTypes = [];
            if (pnpWFSubscription.WorkflowStartEvent != null && pnpWFSubscription.WorkflowStartEvent == true) {
                eventTypes.push('WorkflowStart');
            }
            if (pnpWFSubscription.ItemAddedEvent != null && pnpWFSubscription.ItemAddedEvent == true) {
                eventTypes.push('ItemAdded');
            }
            if (pnpWFSubscription.ItemUpdatedEvent != null && pnpWFSubscription.ItemUpdatedEvent == true) {
                eventTypes.push('ItemUpdated');
            }
            wfSubscription.set_eventTypes(eventTypes);

            wfSubscription.setProperty("HistoryListId", historyListId);
            wfSubscription.setProperty("TaskListId", taskListId);

            if (targetListId)
                wfSubscriptionService.publishSubscriptionForList(wfSubscription, targetListId);
            else {
                wfSubscription.set_eventSourceId(web.get_id());
                wfSubscriptionService.publishSubscription(wfSubscription);
            }
            return executeContext.executeQueryPromise();
        });
        return promises;
    }


    function getNavSource(pnpType) {
        if (pnpType == 'Inherit')
            return SP.Publishing.Navigation.StandardNavigationSource.inheritFromParentWeb;
        else if (pnpType == 'Structural')
            return SP.Publishing.Navigation.StandardNavigationSource.portalProvider;
        else if (pnpType == 'Managed')
            return SP.Publishing.Navigation.StandardNavigationSource.taxonomyProvider;
        return SP.Publishing.Navigation.StandardNavigationSource.unknown;

    }
    function getNavigationNodeUrl(context, url) {
        if (url == null || url == '') return '';
        if (url == '/') return context.get_url();
        if (url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://') || url.startsWith('/')) return url;

        return context.get_url() + '/' + url;
    }

    var provisionNavigation = function (context, pnpNavigation) {
        var d = $.Deferred();
        austal.utils.loadPublishingScripts(function () {
            provisionNavigationInternal(context, pnpNavigation).done(function () {
                d.resolve();
            }).fail(function () {
                d.reject();
            });
        });
        return d;
    }

    function provisionNavigationInternal(context, pnpNavigation) {

        var promises = $.when(1);
        var pnpGlobalNavigation = pnpNavigation.GlobalNavigation;
        var pnpCurrentNavigation = pnpNavigation.CurrentNavigation;

        var quickLaunches = null;

        var web = context.get_web();
        var executeContext = getExecuteContext(context);


        promises = promises.then(function () {
            var webNavSettings = new SP.Publishing.Navigation.WebNavigationSettings(executeContext, web);
            webNavSettings.set_addNewPagesToNavigation(false); //don't add new pages in navigation by default
            var currentNavigation = webNavSettings.get_currentNavigation();
            var globalNavigation = webNavSettings.get_globalNavigation();
            var currentNavSource = getNavSource(pnpCurrentNavigation.NavigationType);
            var globalNavSource = getNavSource(pnpGlobalNavigation.NavigationType);
            currentNavigation.set_source(currentNavSource);
            globalNavigation.set_source(globalNavSource);

            webNavSettings.update();
            return executeContext.executeQueryPromise();
        });

        promises = promises.then(function () {
            quickLaunches = web.get_navigation().get_quickLaunch();
            executeContext.load(quickLaunches);
            return executeContext.executeQueryPromise();
        });


        promises = promises.then(function () {
            if (pnpCurrentNavigation.StructuralNavigation == null || pnpCurrentNavigation.StructuralNavigation.NavigationNode == null) return {};
            if (pnpCurrentNavigation.StructuralNavigation && pnpCurrentNavigation.StructuralNavigation.RemoveExistingNodes == true) {
                var c = quickLaunches.get_count();
                for (var i = 0; i < c; i++) {
                    quickLaunches.get_item(0).deleteObject();
                }
            }

            var pnpNavigationNodes = pnpCurrentNavigation.StructuralNavigation.NavigationNode;

            addNavNodeRecursive(executeContext, pnpNavigationNodes, quickLaunches, null);

            //for (var j = 0; j < pnpNavigationNodes.length; j++) {
            //    var currentPnpNode = pnpNavigationNodes[j];
            //    var nv = new SP.NavigationNodeCreationInformation();
            //    nv.set_isExternal(currentPnpNode.IsExternal == null ? false : currentPnpNode.IsExternal);
            //    nv.set_title(currentPnpNode.Title);
            //    nv.set_url(getNavigationNodeUrl(executeContext, currentPnpNode.Url));
            //    nv.set_asLastNode(true);
            //    var newNode = quickLaunches.add(nv);
            //    addNavNodeRecursive(executeContext, currentPnpNode.NavigationNode, newNode);
            //}
            return executeContext.executeQueryPromise();

        });

        return promises;
    }
    function addNavNodeRecursive(executeContext, pnpNodes, quickLaunches, parentNode) {
        if (pnpNodes == null) return;
        for (var i = 0; i < pnpNodes.length; i++) {
            var currentPnpNode = pnpNodes[i];
            var nv = new SP.NavigationNodeCreationInformation();
            nv.set_isExternal(currentPnpNode.IsExternal == null ? false : currentPnpNode.IsExternal);
            nv.set_title(currentPnpNode.Title);
            var url = getNavigationNodeUrl(executeContext, currentPnpNode.Url);
            nv.set_url(url);
            nv.set_asLastNode(true);
            if (parentNode == null) {
                var newNode = quickLaunches.add(nv);
                addNavNodeRecursive(executeContext, currentPnpNode.NavigationNode, quickLaunches, newNode);
            }
            else
                parentNode.get_children().add(nv);
        }
    }

    var provisionPublishingPages = function (context, pnpPages) {
        var d = $.Deferred();
        austal.utils.loadPublishingScripts(function () {
            provisionPublishingPagesInternal(context, pnpPages).done(function () {
                d.resolve();
            }).fail(function () {
                d.reject();
            });
        });
        return d;
    }

    function provisionPublishingPagesInternal(context, pnpPages) {
        var web = context.get_web();
        var executeContext = getExecuteContext(context);

        var promises = $.when(1);
        var pageLayouts = null;
        var publishingPages;
        promises = promises.then(function () {
            var masterPageGallery = context.get_site().get_rootWeb().get_lists().getByTitle('Master Page Gallery');
            var camlQuery = new SP.CamlQuery();
            var query = "<View><Query><Where><BeginsWith><FieldRef Name='ContentTypeId' /><Value Type='ContentTypeId'>{0}</Value></BeginsWith></Where></Query><ViewFields><FieldRef Name='Title' /></ViewFields></View>";
            camlQuery.set_viewXml(query.format(austal.common.constants.PageLayoutContentTypeId));
            pageLayouts = masterPageGallery.getItems(camlQuery);
            executeContext.load(pageLayouts);
            executeContext.load(web, 'Title', 'ServerRelativeUrl');
            return executeContext.executeQueryPromise();
        });
        promises = promises.then(function () {
            pageLayouts = austal.spHelper.getEnumerationList(pageLayouts);
            return austal.spHelper.getListItems(context, 'Pages', 100, 'FileLeafRef', function (pgs) {
                publishingPages = pgs;
            });
        });

        var webServerRelativeUrl = web.get_serverRelativeUrl();
        for (var i = 0; i < pnpPages.length; i++) {

            (function (pnpPage) {
                var newPage, pageExists;

                promises = promises.then(function () {
                    var pageServerRelativeUrl = webServerRelativeUrl + '/' + pnpPage.Url;
                    pageExists = ko.utils.arrayFirst(publishingPages, function (pp) {
                        return pp.get_item('FileLeafRef').toLowerCase() == pageServerRelativeUrl.toLowerCase();
                    }) != null;
                    return {};
                });

                promises = promises.then(function () {
                    if (pageExists) return {};
                    var publishingWeb = SP.Publishing.PublishingWeb.getPublishingWeb(executeContext, web);
                    var pubPageInfo = new SP.Publishing.PublishingPageInformation();
                    pubPageInfo.set_name(pnpPage.Url);

                    var pageLayout = ko.utils.arrayFirst(pageLayouts, function (pl) {
                        return pl.get_item('Title') != null && pl.get_item('Title').toLowerCase() == pnpPage.Layout.toLowerCase();
                    });

                    pubPageInfo.set_pageLayoutListItem(pageLayout);
                    newPage = publishingWeb.addPublishingPage(pubPageInfo);
                    executeContext.load(newPage);
                    return executeContext.executeQueryPromise();
                });
                promises = promises.then(function () {
                    if (pageExists) return {};
                    var pageListItem = newPage.get_listItem();
                    pageListItem.set_item("Title", pnpPage.Title);
                    if (pnpPage.SEOTitle) {
                        pageListItem.set_item('SeoBrowserTitle', pnpPage.SEOTitle);
                    }
                    pageListItem.update();
                    pageListItem.get_file().checkIn();
                    pageListItem.get_file().publish("Publishing after creation");
                    return executeContext.executeQueryPromise();
                });

                promises = promises.then(function () {
                    if (!pageExists && pnpPage.Security)
                        return applySecurity(context, newPage.get_listItem(), pnpPage.Security);
                    return {};
                });

            })(pnpPages[i]);
        }


        return promises;
    }


    var getRESTRequest = function (url, callback) {
        return $.ajax({
            url: url,
            'method': 'GET',
            'cache': false,
            'headers': {
                "Accept": "application/json; odata=verbose"
            },
            success: callback,
            error: callback
        });
    }
    var startWorkflowOnListItem = function (context, subscription, itemId, initiationParameters) {
        var d = $.Deferred();
        var executeContext = getExecuteContext(context);
        var web = context.get_web();
        austal.utils.loadWFScripts(function () {
            var wfServicesManager = new SP.WorkflowServices.WorkflowServicesManager(executeContext, web);
            var instanceService = wfServicesManager.getWorkflowInstanceService();
            if (itemId != null && itemId != 0)
                instanceService.startWorkflowOnListItem(subscription, itemId, initiationParameters);
            else
                instanceService.startWorkflow(subscription, initiationParameters);

            executeContext.executeQueryAsync(function () {
                d.resolve();
            }, function () {
                d.reject();
            });
        });
        return d;
    }
    var setWelcomePage = function (context, url) {
        var web = context.get_web();
        var executeContext = getExecuteContext(context);
        var rootFolder = web.get_rootFolder();
        rootFolder.set_welcomePage(url);
        rootFolder.update();
        return executeContext.executeQueryPromise();
    }
    var getFromExternalService = function (context, url, callback) {
        var d = $.Deferred();
        var request = new SP.WebRequestInfo();
        request.set_url(url);
        request.set_method("GET");
        request.set_headers({
            "Accept": "application/json;odata=verbose"
        });
        var executeContext = getExecuteContext(context);
        var response = SP.WebProxy.invoke(executeContext, request);
        executeContext.executeQueryAsync(function () {
            if (response == null || response.get_statusCode() != 200) {
                callback(null);
                d.reject();
                return;
            }
            callback(JSON.parse(response.get_body()));
            d.resolve();
        }, function () {
            callback(null);
            d.reject();

        });
        return d;
    }

    function getInnerHTMLContent(node) {
        if (node.innerHTML) return node.innerHTML;
        var elementNode;
        if (node.childNodes.length == 1) {
            elementNode = node.childNodes[0];
        }
        else {
            elementNode = ko.utils.arrayFirst(node.childNodes, function (n) {
                return n.nodeType == n.ELEMENT_NODE;
            });
        }
        return (new window.XMLSerializer()).serializeToString(elementNode);
    }

    var populateList = function (context, listTitle, dataRows) {
        var web = context.get_web();
        var executeContext = getExecuteContext(context);
        var promises = $.when(1);

        var rowsToAdd = [], existingRows;

        promises = promises.then(function () {
            executeContext.load(web, 'Url');
            return executeContext.executeQueryPromise();
        });

        promises = promises.then(function () {
            return parseDataRows(dataRows, function (rs) {
                rowsToAdd = rs;
            });
        });

        promises = promises.then(function () {
            var d = $.Deferred();
            var list = web.get_lists().getByTitle(listTitle);
            var iPromises = $.when(1);
            for (var i = 0; i < rowsToAdd.length; i++) {
                (function (dr) {
                    var listItem;
                    iPromises = iPromises.then(function () {
                        var liCreationInfo = new SP.ListItemCreationInformation();
                        listItem = list.addItem(liCreationInfo);
                        for (var propertyName in dr) {
                            if (dr.hasOwnProperty(propertyName) && propertyName != '_Attachments')
                                listItem.set_item(propertyName, dr[propertyName]);
                        }
                        executeContext.load(listItem, 'Id');
                        listItem.update();
                        return executeContext.executeQueryPromise();
                    });

                    if (dr._Attachments && dr._Attachments.length > 0) {
                        for (var j = 0; j < dr._Attachments.length; j++) {
                            (function (attachment) {
                                iPromises = iPromises.then(function () {
                                    var fileUrl = attachment.Url.startsWith('/') ? attachment.Url : _spPageContextInfo.webServerRelativeUrl + '/' + attachment.Url;
                                    var content = null;
                                    return getFileContentAsBinary(_spPageContextInfo.webAbsoluteUrl, fileUrl, function (c) {
                                        content = c;
                                    }).then(function () {
                                        return addAttachmentToListItem(context, web.get_url(), listTitle, listItem.get_id(), attachment.Name, content);
                                    });


                                });
                            })(dr._Attachments[j]);
                        }
                    }

                })(rowsToAdd[i]);
            }
            iPromises.done(function () {
                d.resolve();
            }).fail(function () {
                d.reject();
            });

            return d;
        });

        return promises;
    }


    function addAttachmentToListItem(context, siteUrl, listTitle, listItemId, fileName, content) {
        var d = $.Deferred();
        var re = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
        try {
            var url = "{0}/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('{1}')/items({2})/AttachmentFiles/add(FileName='{3}')?@target='{4}'"
                    .format(_spPageContextInfo.webAbsoluteUrl, listTitle, listItemId, fileName, siteUrl);
            re.executeAsync({
                url: url,
                method: "POST",
                binaryStringRequestBody: true,
                body: content,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function () {
                    d.resolve();
                },
                error: function () {
                    d.reject();
                }
            });
        } catch (e) {
            d.reject();
        }
        return d;
    }
    function parseDataRows(dataRows, callback) {
        var promises = $.when(1);
        var rowsToAdd = [];

        for (var i = 0; i < dataRows.length; i++) {
            if (dataRows[i]._url == null) {
                rowsToAdd.push(dataRows[i]);
                continue;
            }

            //data row is an url, so load rows from url
            (function (dr) {
                var fileUrl = dr._url.startsWith('/') ? dr._url : _spPageContextInfo.webServerRelativeUrl + '/' + dr._url;
                promises = promises.then(function () {
                    return getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, function (c) {
                        if (dr._type != 'xml') return; //support xml only now, will support json if I get paid.
                        var xmlResponse = $.parseXML(c);
                        if (xmlResponse.firstChild.localName != 'DataRows') return;
                        for (var j = 0; j < xmlResponse.firstChild.childNodes.length; j++) {
                            var row = xmlResponse.firstChild.childNodes[j];
                            if (row.nodeType != row.ELEMENT_NODE || row.localName != 'DataRow') continue;
                            var r = {
                            };
                            for (var k = 0; k < row.childNodes.length; k++) {
                                if (row.childNodes[k].nodeType == row.ELEMENT_NODE)
                                    r[row.childNodes[k].localName] = getInnerHTMLContent(row.childNodes[k]);
                            }
                            rowsToAdd.push(r);

                        }
                    });
                });
            })(dataRows[i]);

        }

        promises = promises.then(function () {
            callback(rowsToAdd);
            return {};
        });

        return promises;
    }

    var setupPermissionForList = function (context, listTitle, pnpSecurity) {
        var web = context.get_web();
        var list = web.get_lists().getByTitle(listTitle);
        return applySecurity(context, list, pnpSecurity);
    }

    function applySecurity(context, securableObject, pnpSecurity) {
        var pnpPermission = pnpSecurity.BreakRoleInheritance;
        var web = context.get_web();
        var executeContext = getExecuteContext(context);
        var roleAssignments, siteGroups;
        var promises = $.when(1);

        promises = promises.then(function () {
            securableObject.breakRoleInheritance(pnpPermission.CopyRoleAssignments, pnpPermission.ClearSubscopes);
            executeContext.load(web, 'Title');
            return executeContext.executeQueryPromise();
        });

        promises = promises.then(function () {
            roleAssignments = securableObject.get_roleAssignments();
            executeContext.load(roleAssignments, 'Include(Member,RoleDefinitionBindings.Include(Name))');
            siteGroups = web.get_siteGroups();
            executeContext.load(siteGroups, 'Include(LoginName)');
            return executeContext.executeQueryPromise();
        });

        promises = promises.then(function () {
            roleAssignments = getEnumerationList(roleAssignments);
            siteGroups = getEnumerationList(siteGroups);
            return {};
        });


        for (var i = 0; i < pnpPermission.RoleAssignment.length; i++) {
            (function (pnpRoleAssignment) {
                promises = promises.then(function () {
                    var roleDefinitionName = pnpRoleAssignment.RoleDefinition;
                    var roleDefinition = web.get_roleDefinitions().getByName(roleDefinitionName);

                    //check role in current object
                    var existingRole = ko.utils.arrayFirst(roleAssignments, function (ra) {
                        return ra.get_member().get_title().toLowerCase() == pnpRoleAssignment.Principal.toLowerCase();
                    });

                    if (existingRole == null) {
                        var newRole = ko.utils.arrayFirst(siteGroups, function (sg) {
                            return sg.get_loginName().toLowerCase() == pnpRoleAssignment.Principal.toLowerCase();
                        });
                        if (newRole == null) {
                            newRole = web.ensureUser(pnpRoleAssignment.Principal);
                        }
                        var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(executeContext);
                        collRoleDefinitionBinding.add(roleDefinition);
                        securableObject.get_roleAssignments().add(newRole, collRoleDefinitionBinding);
                    }
                    else {
                        var existingRoleBindings = getEnumerationList(existingRole.get_roleDefinitionBindings());
                        var existingRoleBinding = ko.utils.arrayFirst(existingRoleBindings, function (rdb) {
                            return rdb.get_name().toLowerCase() == roleDefinitionName.toLowerCase();
                        });
                        if (existingRoleBinding == null) {
                            //var roleDefinitionBindingCollection = new SP.RoleDefinitionBindingCollection.newObject(executeContext);
                            //existingRole.get_roleDefinitionBindings().removeAll();
                            existingRole.get_roleDefinitionBindings().add(roleDefinition);
                            existingRole.update();
                        }
                    }
                    return executeContext.executeQueryPromise();
                });
            })(pnpPermission.RoleAssignment[i]);
        }
        return promises;
    }



    //END - Public functions

    return {
        activateDeactivateWebFeatures: activateDeactivateWebFeatures,
        addContentTypeToList: addContentTypeToList,
        addCustomAction: addCustomAction,
        addEnterpriseKeywordColumnsToList: addEnterpriseKeywordColumnsToList,
        addFieldToList: addFieldToList,
        addWorkflowSubscription: addWorkflowSubscription,
        addUserToGroup: addUserToGroup,
        createGroup: createGroup,
        createList: createList,
        createViews: createViews,
        createWebField: createWebField,
        createWebContentType: createWebContentType,
        enableListContentType: enableListContentType,
        getActivatedFeatures: getActivatedFeatures,
        getAllLists: getAllLists,
        getCurrentUser: getCurrentUser,
        getListInfo: getListInfo,
        getAllwebs: getAllwebs,
        getAllSiteGroups: getAllSiteGroups,
        getAvailableContentTypes: getAvailableContentTypes,
        getAvailableFields: getAvailableFields,
        getListFields: getListFields,
        getListContentTypes: getListContentTypes,
        getFilesInfo: getFilesInfo,
        getFileContent: getFileContent,
        getFileContentAsBinary: getFileContentAsBinary,
        getFromExternalService: getFromExternalService,
        getListItems: getListItems,
        getListItemsbyIds: getListItemsbyIds,
        getExecuteContext: getExecuteContext,
        getEnumerationList: getEnumerationList,
        getRESTRequest: getRESTRequest,
        initialize: initialize,
        populateList: populateList,
        provisionNavigation: provisionNavigation,
        provisionPublishingPages: provisionPublishingPages,
        removeAllContentTypesBut: removeAllContentTypesBut,
        setupPermissionForList: setupPermissionForList,
        setWelcomePage: setWelcomePage,
        startWorkflowOnListItem: startWorkflowOnListItem,
        updateListField: updateListField,
        updateListFieldChoices: updateListFieldChoices
    };
})();
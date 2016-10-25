function $_global_clienttemplates() {
    {
        if ("undefined" == typeof g_all_modules) {
            g_all_modules = {};
        }
        g_all_modules["clienttemplates.js"] = {
            "version": {
                "rmj": 16,
                "rmm": 0,
                "rup": 5701,
                "rpr": 1212
            }
        };
    }
    if (typeof spWriteProfilerMark == 'function')
        spWriteProfilerMark("perfMarkBegin_" + "clienttemplates.js");
    ContextMenu.prototype.open = function(openSubMenu) {
    };
    ContextMenu.prototype.root = function() {
        return null;
    };
    ContextMenu.IsOpen = function() {
        var m = document.querySelector(".ms-js-contextmenu");

        return Boolean(m);
    };
    ContextMenu._idUniqueNum = 0;
    if (typeof window.SPListView == "undefined") {
        window.SPListView = false;
    }
    isSLV = typeof SingleListView != "undefined";
    InitListViewSettings();
    bListViewSettingsInitialized = false;
    bListViewStringsInitialized = false;
    InitListViewStrings();
    if (typeof window["ListView"] == "undefined") {
        window["ListView"] = new Object();
    }
    if (typeof window["ListView"]["ImageBasePath"] == "undefined") {
        window["ListView"]["ImageBasePath"] = "";
    }
    clientHierarchyManagers = [];
    ClientHierarchyManager = function(wpq, bRtl) {
        clientHierarchyManagers.push(this);
        var _wpq = wpq;
        var _expandedState = {};
        var _itemIdToTrIdMap = {};
        var _imgToItemIdMap = {};
        var _childrenMap = {};
        var _itemIdToImgIdMap = {};

        this.Matches = function(wpqToMatch) {
            return wpqToMatch == _wpq;
        };
        this.RegisterHierarchyNode = function(itemId, parentId, trId, imgId) {
            _expandedState[itemId] = true;
            _itemIdToTrIdMap[itemId] = trId;
            _imgToItemIdMap[imgId] = itemId;
            _itemIdToImgIdMap[itemId] = imgId;
            _childrenMap[itemId] = [];
            if (parentId != null) {
                _childrenMap[parentId].push(itemId);
            }
        };
        this.IsParent = function(itemId) {
            return itemId in _childrenMap && _childrenMap[itemId].length > 0;
        };
        this.ToggleExpandByImg = function(img) {
            if (!(img.id in _imgToItemIdMap)) {
                return;
            }
            var itemId = _imgToItemIdMap[img.id];

            ToggleExpand(itemId, img);
        };
        this.ToggleExpandById = function(itemId) {
            if (itemId == null) {
                return;
            }
            if (!(itemId in _itemIdToImgIdMap)) {
                return;
            }
            var imgId = _itemIdToImgIdMap[itemId];
            var img = $get(imgId);

            if (img == null) {
                return;
            }
            ToggleExpand(itemId, img);
        };
        this.GetToggleStateById = function(itemId) {
            if (itemId == null) {
                return 0;
            }
            if (!(itemId in _expandedState)) {
                return 0;
            }
            if (_childrenMap[itemId].length == 0) {
                return 0;
            }
            return _expandedState[itemId] ? 1 : 2;
        };
        function ToggleExpand(itemId, span) {
            var bExpanding = !_expandedState[itemId];

            if (bExpanding) {
                span.firstChild.className = 'ms-commentcollapse' + (bRtl ? 'rtl' : '') + '-icon';
                ExpandChildren(itemId);
            }
            else {
                span.firstChild.className = 'ms-commentexpand' + (bRtl ? 'rtl' : '') + '-icon';
                CollapseChildren(itemId);
            }
            _expandedState[itemId] = bExpanding;
        }
        function ExpandChildren(id) {
            for (var i = 0; i < _childrenMap[id].length; i++) {
                (document.getElementById(_itemIdToTrIdMap[_childrenMap[id][i]])).style.display = '';
                if (_expandedState[_childrenMap[id][i]]) {
                    ExpandChildren(_childrenMap[id][i]);
                }
            }
        }
        function CollapseChildren(id) {
            for (var i = 0; i < _childrenMap[id].length; i++) {
                (document.getElementById(_itemIdToTrIdMap[_childrenMap[id][i]])).style.display = 'none';
                CollapseChildren(_childrenMap[id][i]);
            }
        }
    };
    if (window["ClientPivotControl"] == null) {
        var ClientPivotControl = function(controlProps) {
            this.AllOptions = [];
            if (controlProps != null) {
                this.PivotParentId = controlProps.PivotParentId;
                this.PivotContainerId = controlProps.PivotContainerId;
                if (typeof controlProps.AllOptions != "undefined")
                    this.AllOptions = controlProps.AllOptions;
                if (typeof controlProps.SurfacedPivotCount == "number")
                    this.SurfacedPivotCount = Number(controlProps.SurfacedPivotCount);
                if (typeof controlProps.ShowMenuIcons != "undefined")
                    this.ShowMenuIcons = Boolean(controlProps.ShowMenuIcons);
                if (typeof controlProps.ShowMenuClose != "undefined")
                    this.ShowMenuClose = controlProps.ShowMenuClose;
                if (typeof controlProps.ShowMenuCheckboxes != "undefined")
                    this.ShowMenuCheckboxes = controlProps.ShowMenuCheckboxes;
                if (typeof controlProps.Width != "undefined")
                    this.Width = controlProps.Width;
            }
            else {
                this.PivotContainerId = 'clientPivotControl' + ClientPivotControl.PivotControlCount.toString();
            }
            this.OverflowDotId = this.PivotContainerId + '_overflow';
            this.OverflowMenuId = this.PivotContainerId + '_menu';
            ClientPivotControl.PivotControlCount++;
            ClientPivotControl.PivotControlDict[this.PivotContainerId] = this;
        };

        ClientPivotControl.PivotControlDict = [];
        ClientPivotControl.PivotControlCount = 0;
        ClientPivotControl.prototype = {
            PivotParentId: '',
            PivotContainerId: '',
            OverflowDotId: '',
            OverflowMenuId: '',
            AllOptions: [],
            SurfacedPivotCount: 3,
            ShowMenuIcons: false,
            ShowMenuClose: false,
            ShowMenuCheckboxes: false,
            OverflowMenuScript: '',
            Width: '',
            SurfacedOptions: [],
            OverflowOptions: [],
            SelectedOptionIdx: -1,
            AddMenuOption: function(option) {
                if (ClientPivotControl.IsMenuOption(option) || ClientPivotControl.IsMenuCheckOption(option))
                    this.AllOptions.push(option);
            },
            AddMenuSeparator: function() {
                if (this.AllOptions.length == 0)
                    return;
                var lastItem = this.AllOptions[this.AllOptions.length - 1];

                if (ClientPivotControl.IsMenuSeparator(lastItem))
                    return;
                this.AllOptions.push(new ClientPivotControlMenuSeparator());
            },
            Render: function() {
                if (this.PivotParentId == null || this.PivotParentId == '')
                    return;
                var parentElt = document.getElementById(this.PivotParentId);

                if (parentElt == null)
                    return;
                parentElt.innerHTML = this.RenderAsString();
                if (this.Width != '')
                    parentElt.style.width = this.Width;
            },
            RenderAsString: function() {
                this.ProcessAllMenuItems();
                this.EnsureSelectedOption();
                var surfacedCount = this.SurfacedOptions.length;

                if (surfacedCount == 0)
                    return '';
                var result = [];

                result.push('<span class="ms-pivotControl-container" id="');
                result.push(Encoding.HtmlEncode(this.PivotContainerId));
                result.push('" role="view">');
                for (var idx = 0; idx < surfacedCount; idx++)
                    result.push(this.RenderSurfacedOption(idx));
                if (this.ShouldShowOverflowMenuLink())
                    result.push(this.RenderOverflowMenuLink());
                result.push("</span>");
                return result.join('');
            },
            ShouldShowOverflowMenuLink: function() {
                if (ListModule.Settings.SupportsPopup) {
                    return this.OverflowOptions.length > 0 || this.OverflowMenuScript != null && this.OverflowMenuScript != '';
                }
                return false;
            },
            ShowOverflowMenu: function() {
                if (ListModule.Settings.SupportsPopup) {
                    var numOpts = this.OverflowOptions.length;
                    var dotElt = document.getElementById(this.OverflowDotId);

                    if (dotElt == null || numOpts == 0)
                        return;
                    MenuHtc_hide();
                    var menu = CMenu(this.OverflowMenuId);

                    for (var idx = 0; idx < numOpts; idx++) {
                        var opt = this.OverflowOptions[idx];
                        var isCheckOption = ClientPivotControl.IsMenuCheckOption(opt);

                        if (ClientPivotControl.IsMenuOption(opt) || isCheckOption) {
                            var addedOption = CAMOpt(menu, opt.DisplayText, opt.OnClickAction, opt.ImageUrl, opt.ImageAltText, String(100 * idx), opt.Description);

                            addedOption.id = 'ID_OverflowOption_' + String(idx);
                            if (isCheckOption) {
                                addedOption.setAttribute('checked', opt.Checked);
                            }
                        }
                        else if (ClientPivotControl.IsMenuSeparator(opt)) {
                            CAMSep(menu);
                        }
                    }
                    if (!this.ShowMenuIcons)
                        menu.setAttribute("hideicons", "true");
                    var oldFlipValue = Boolean(document.body['WZ_ATTRIB_FLIPPED']);

                    document.body['WZ_ATTRIB_FLIPPED'] = false;
                    OMenu(menu, dotElt, null, false, -2, this.ShowMenuClose, this.ShowMenuCheckboxes);
                    document.body['WZ_ATTRIB_FLIPPED'] = oldFlipValue;
                }
            },
            RenderSurfacedOption: function(optIdx) {
                if (optIdx < 0 || optIdx >= this.SurfacedOptions.length)
                    return '';
                var surfaceOpt = this.SurfacedOptions[optIdx];
                var className = 'ms-pivotControl-surfacedOpt';

                if (surfaceOpt.SelectedOption)
                    className += '-selected';
                var optRes = [];

                optRes.push('<a class="');
                optRes.push(className);
                optRes.push('" href="#" id="');
                optRes.push(Encoding.HtmlEncode(this.PivotContainerId + '_surfaceopt' + optIdx.toString()));
                optRes.push('" onclick="');
                if (!(window["OffSwitch"] == null || OffSwitch.IsActive("FD8DB143-ED17-47C8-AF2F-46BA4407795B"))) {
                    optRes.push(Encoding.HtmlEncode('SP.QoS.WriteUserEngagement("ClientPivot_ViewSelected");'));
                }
                optRes.push(Encoding.HtmlEncode(surfaceOpt.OnClickAction));
                optRes.push(' return false;" aria-label="');
                if (optIdx == 0)
                    optRes.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_ViewPivots_alt"]));
                else
                    optRes.push(Encoding.HtmlEncode(surfaceOpt.DisplayText));
                optRes.push(', ');
                optRes.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_ViewPivots_View_alt"]));
                if (surfaceOpt.SelectedOption) {
                    optRes.push(', ');
                    optRes.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_ViewPivots_View_Selected_alt"]));
                    optRes.push('" role="view" aria-selected="true">');
                }
                else
                    optRes.push('" role="view">');
                optRes.push(Encoding.HtmlEncode(surfaceOpt.DisplayText));
                optRes.push('</a>');
                return optRes.join('');
            },
            RenderOverflowMenuLink: function() {
                var onClickAction = this.OverflowMenuScript;

                if (onClickAction == null || onClickAction == '')
                    onClickAction = 'ClientPivotControlExpandOverflowMenu(event);';
                var menuRes = [];

                menuRes.push('<span class="ms-pivotControl-overflowSpan" data-containerId="');
                menuRes.push(Encoding.HtmlEncode(this.PivotContainerId));
                menuRes.push('" id="');
                menuRes.push(Encoding.HtmlEncode(this.OverflowDotId));
                menuRes.push('" title="');
                menuRes.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_ClientPivotControlOverflowMenuAlt"]));
                menuRes.push('" ><a class="ms-pivotControl-overflowDot" href="#" onclick="');
                if (!(window["OffSwitch"] == null || OffSwitch.IsActive("FD8DB143-ED17-47C8-AF2F-46BA4407795B"))) {
                    menuRes.push(Encoding.HtmlEncode('SP.QoS.WriteUserEngagement("ClientPivot_ViewSelected");'));
                }
                menuRes.push(Encoding.HtmlEncode(onClickAction));
                menuRes.push('" role="button" aria-label="');
                menuRes.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_ClientPivotControlOverflowMenuAlt"]));
                menuRes.push('" >');
                menuRes.push('<img class="ms-ellipsis-icon" src="');
                menuRes.push(GetThemedImageUrl('spcommon.png'));
                menuRes.push('" alt="');
                menuRes.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_OpenMenu"]));
                menuRes.push('" /></a></span>');
                return menuRes.join('');
            },
            ProcessAllMenuItems: function() {
                if (this.SurfacedPivotCount < 0)
                    this.SurfacedPivotCount = 1;
                this.SurfacedOptions = [];
                this.OverflowOptions = [];
                var allOptionCount = this.AllOptions.length;

                if (allOptionCount == 0)
                    return;
                var optIdx = 0;
                var trimOpts = [];

                for (; optIdx < allOptionCount; optIdx++) {
                    var sOpt = this.AllOptions[optIdx];

                    if (ClientPivotControl.IsMenuSeparator(sOpt))
                        continue;
                    if (trimOpts.length == this.SurfacedPivotCount)
                        break;
                    trimOpts.push(sOpt);
                }
                this.SurfacedOptions = this.SurfacedOptions.concat(trimOpts);
                if (optIdx != allOptionCount) {
                    for (; optIdx < allOptionCount; optIdx++)
                        this.OverflowOptions.push(this.AllOptions[optIdx]);
                    var lastMenuOpt = this.OverflowOptions[this.OverflowOptions.length - 1];

                    if (ClientPivotControl.IsMenuSeparator(lastMenuOpt))
                        this.OverflowOptions.pop();
                }
            },
            EnsureSelectedOption: function() {
                this.SelectedOptionIdx = -1;
                var surfacedCount = this.SurfacedOptions.length;
                var overflowCount = this.OverflowOptions.length;

                if (surfacedCount == 0 && overflowCount == 0)
                    return;
                for (var surIdx = 0; surIdx < this.SurfacedOptions.length; surIdx++) {
                    var surfacedOpt = this.SurfacedOptions[surIdx];

                    if (Boolean(surfacedOpt.SelectedOption) && this.SelectedOptionIdx == -1)
                        this.SelectedOptionIdx = surIdx;
                    else
                        surfacedOpt.SelectedOption = false;
                }
                for (var overIdx = 0; overIdx < this.OverflowOptions.length; overIdx++) {
                    var overflowOpt = this.OverflowOptions[overIdx];

                    if (Boolean(overflowOpt.SelectedOption) && this.SelectedOptionIdx == -1) {
                        this.SelectedOptionIdx = this.SurfacedOptions.length;
                    }
                    else {
                        if (ClientPivotControl.IsMenuOption(overflowOpt))
                            overflowOpt.SelectedOption = false;
                    }
                }
                if (this.SelectedOptionIdx == -1) {
                    this.SelectedOptionIdx = 0;
                    this.SurfacedOptions[0].SelectedOption = true;
                }
                else if (this.SelectedOptionIdx == this.SurfacedOptions.length) {
                    var shiftOpt = this.SurfacedOptions.pop();
                    var oldOverflowOpts = this.OverflowOptions;

                    this.OverflowOptions = [];
                    this.OverflowOptions.push(shiftOpt);
                    for (var i = 0; i < oldOverflowOpts.length; i++) {
                        var overflow = oldOverflowOpts[i];

                        if (Boolean(overflow.SelectedOption))
                            this.SurfacedOptions.push(overflow);
                        else
                            this.OverflowOptions.push(overflow);
                    }
                    this.SelectedOptionIdx = this.SurfacedOptions.length - 1;
                }
            }
        };
        var ClientPivotControlExpandOverflowMenu = function(evt) {
            if (ListModule.Settings.SupportsPopup) {
                if (evt == null)
                    evt = window.event;
                var elm = DOM.GetEventSrcElement(evt);

                while (elm != null && elm.getAttribute('data-containerId') == null)
                    elm = elm.parentNode;
                if (elm == null)
                    return;
                var menuContext;

                try {
                    menuContext = typeof CMenu;
                }
                catch (e) {
                    menuContext = "undefined";
                }
                EnsureScript("core.js", menuContext, function() {
                    var pivotCtrl = ClientPivotControl.PivotControlDict[elm.getAttribute('data-containerId')];

                    if (pivotCtrl != null)
                        pivotCtrl.ShowOverflowMenu();
                });
                if (evt != null)
                    CancelEvent(evt);
            }
        };
        var ClientPivotControl_InitStandaloneControlWrapper = function(controlProps) {
            if (controlProps == null)
                return;
            var pivot = new ClientPivotControl(controlProps);

            pivot.Render();
        };

        ClientPivotControl.MenuOptionType = {
            MenuOption: 1,
            MenuSeparator: 2,
            MenuCheckOption: 3
        };
        ClientPivotControl.IsMenuOption = function(menuOpt) {
            return menuOpt != null && menuOpt.MenuOptionType == ClientPivotControl.MenuOptionType.MenuOption;
        };
        ClientPivotControl.IsMenuCheckOption = function(menuOpt) {
            return menuOpt != null && menuOpt.MenuOptionType == ClientPivotControl.MenuOptionType.MenuCheckOption;
        };
        ClientPivotControl.IsMenuSeparator = function(menuOpt) {
            return menuOpt != null && menuOpt.MenuOptionType == ClientPivotControl.MenuOptionType.MenuSeparator;
        };
        var ClientPivotControlMenuItem = function() {
        };

        ClientPivotControlMenuItem.prototype = {
            MenuOptionType: 0
        };
        var ClientPivotControlMenuOption = function() {
            this.MenuOptionType = ClientPivotControl.MenuOptionType.MenuOption;
        };

        ClientPivotControlMenuOption.prototype = new ClientPivotControlMenuItem();
        ClientPivotControlMenuOption.prototype.DisplayText = '';
        ClientPivotControlMenuOption.prototype.Description = '';
        ClientPivotControlMenuOption.prototype.OnClickAction = '';
        ClientPivotControlMenuOption.prototype.ImageUrl = '';
        ClientPivotControlMenuOption.prototype.ImageAltText = '';
        ClientPivotControlMenuOption.prototype.SelectedOption = false;
        var ClientPivotControlMenuSeparator = function() {
            this.MenuOptionType = ClientPivotControl.MenuOptionType.MenuSeparator;
        };

        ClientPivotControlMenuSeparator.prototype = new ClientPivotControlMenuItem();
        var ClientPivotControlMenuCheckOption = function() {
            this.MenuOptionType = ClientPivotControl.MenuOptionType.MenuCheckOption;
        };

        ClientPivotControlMenuCheckOption.prototype = new ClientPivotControlMenuItem();
        ClientPivotControlMenuCheckOption.prototype.Checked = false;
        window.ClientPivotControl = ClientPivotControl;
        window.ClientPivotControlExpandOverflowMenu = ClientPivotControlExpandOverflowMenu;
        window.ClientPivotControl_InitStandaloneControlWrapper = ClientPivotControl_InitStandaloneControlWrapper;
        window.ClientPivotControlMenuCheckOption = ClientPivotControlMenuCheckOption;
        window.ClientPivotControlMenuItem = ClientPivotControlMenuItem;
        window.ClientPivotControlMenuOption = ClientPivotControlMenuOption;
        window.ClientPivotControlMenuSeparator = ClientPivotControlMenuSeparator;
    }
    else {
        ClientPivotControl = window.ClientPivotControl;
        ClientPivotControlExpandOverflowMenu = window.ClientPivotControlExpandOverflowMenu;
        ClientPivotControl_InitStandaloneControlWrapper = window.ClientPivotControl_InitStandaloneControlWrapper;
        ClientPivotControlMenuCheckOption = window.ClientPivotControlMenuCheckOption;
        ClientPivotControlMenuItem = window.ClientPivotControlMenuItem;
        ClientPivotControlMenuOption = window.ClientPivotControlMenuOption;
        ClientPivotControlMenuSeparator = window.ClientPivotControlMenuSeparator;
    }
    SPClientRenderer = {
        GlobalDebugMode: false,
        AddCallStackInfoToErrors: false,
        RenderErrors: true
    };
    SPClientRenderer.IsDebugMode = function(renderCtx) {
        if (typeof renderCtx != "undefined" && null != renderCtx && typeof renderCtx.DebugMode != "undefined") {
            return Boolean(renderCtx.DebugMode);
        }
        else {
            return Boolean(SPClientRenderer.GlobalDebugMode);
        }
    };
    SPClientRenderer.Render = function(node, renderCtx) {
        if (node == null || renderCtx == null)
            return;
        var isSuccessful = true;
        var containsListViewBody = renderCtx.Templates != null && renderCtx.Templates.Body != "" && renderCtx.Templates.Header != "";
        var listTemplateWebPartType = null;

        if (renderCtx.ListTemplateType == 550 && renderCtx.BaseViewID == 3) {
            listTemplateWebPartType = new SitesDocumentsWebPart();
        }
        else if (renderCtx.ListTemplateType == 700 && renderCtx.BaseViewID == 51) {
            listTemplateWebPartType = new MyDocumentsWebPart();
        }
        else if (renderCtx.ListTemplateType == 700 && renderCtx.BaseViewID == 55) {
            listTemplateWebPartType = new SharedFoldersWebPart();
        }
        else if (renderCtx.ListTemplateType == 100 && renderCtx.SiteTemplateId == 64) {
            listTemplateWebPartType = new GroupListsWebPart();
        }
        if (containsListViewBody && listTemplateWebPartType != null) {
            listTemplateWebPartType.TagStart();
        }
        SPClientRenderer._ExecuteRenderCallbacks(renderCtx, 'OnPreRender');
        var result = SPClientRenderer.RenderCore(renderCtx);

        if (renderCtx.Errors != null && renderCtx.Errors.length > 0) {
            var retString = [];

            if (Boolean(SPClientRenderer.RenderErrors)) {
                for (var i = 0; i < renderCtx.Errors.length; i++) {
                    retString.push(renderCtx.Errors[i]);
                }
            }
            result = retString.join("") + " ";
            if (listTemplateWebPartType != null) {
                isSuccessful = false;
                listTemplateWebPartType.LogFailure(result);
            }
        }
        else if (typeof renderCtx.ErrorMsgDelayed != "undefined" && renderCtx.ErrorMsgDelayed != "") {
            if (listTemplateWebPartType != null) {
                isSuccessful = false;
                listTemplateWebPartType.LogFailure(renderCtx.ErrorMsgDelayed);
            }
        }
        if (result != null && result != '') {
            if (node.tagName == "DIV" || node.tagName == "TD") {
                if (renderCtx.fHidden)
                    node.style.display = "none";
                node.innerHTML = result;
            }
            else {
                var container = document.createElement("div");

                container.innerHTML = result;
                var fChild = container.firstChild;

                if (container.childNodes.length == 1 && fChild != null && fChild.nodeType == 3) {
                    var text = document.createTextNode(result);

                    InsertNodeAfter(node, text);
                }
                else {
                    var children = fChild.childNodes;
                    var pNode;

                    pNode = node.parentNode;
                    for (var idx = 0; idx < children.length; idx++) {
                        var childNode = children[idx];

                        if (childNode.nodeType == 1) {
                            if (pNode.nodeName == childNode.nodeName) {
                                var addNodes = childNode.childNodes;
                                var nc = addNodes.length;

                                for (var ix = 0; ix < nc; ix++)
                                    pNode.appendChild(addNodes[0]);
                            }
                            else {
                                if (renderCtx.fHidden)
                                    childNode.style.display = "none";
                                pNode.appendChild(children[idx]);
                                idx--;
                            }
                        }
                    }
                }
            }
        }
        if (containsListViewBody == true && isSuccessful == true && listTemplateWebPartType != null) {
            listTemplateWebPartType.TagSuccess();
        }
        SPClientRenderer._ExecuteRenderCallbacks(renderCtx, 'OnPostRender');
        function SitesDocumentsWebPart() {
            this.TagStart = function() {
                WriteStart("StartSitesDocumentsRender");
            };
            this.LogFailure = function(listRenderError) {
                WriteFailure("FailureSitesDocumentRender_RenderErrors");
                WriteDebugLog("FailureSitesDocumentsRender", true, listRenderError);
            };
            this.TagSuccess = function() {
                WriteSuccess("SuccessSitesDocumentsRender");
            };
        }
        function MyDocumentsWebPart() {
            this.TagStart = function() {
                WriteStart("StartMyDocumentsRender", {
                    AppCacheStatus: Boolean(window.applicationCache) && Boolean(window.applicationCache.status)
                });
            };
            this.LogFailure = function(listRenderError) {
                WriteFailure("FailureMyDocumentsRender_RenderErrors", {
                    AppCacheStatus: Boolean(window.applicationCache) && Boolean(window.applicationCache.status)
                });
                WriteDebugLog("FailureMyDocumentsRender", true, listRenderError);
            };
            this.TagSuccess = function() {
                WriteSuccess("SuccessMyDocumentsRender", {
                    AppCacheStatus: Boolean(window.applicationCache) && Boolean(window.applicationCache.status)
                });
                if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(256)) {
                    WriteEngagementLog("ODInPlaceSearchOn");
                }
                else {
                    WriteEngagementLog("ODInPlaceSearchOff");
                }
                var sharingHintOnOff = "SharingHintOff";

                if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(144)) {
                    var sharingHintStrings = document.querySelectorAll(".js-sharingHintString");

                    if (Boolean(sharingHintStrings) && sharingHintStrings.length > 0) {
                        sharingHintOnOff = "SharingHintOn";
                    }
                }
                WriteEngagementLog(sharingHintOnOff);
            };
        }
        function SharedFoldersWebPart() {
            this.TagStart = function() {
                WriteStart("StartSharedFoldersRender");
            };
            this.LogFailure = function(listRenderError) {
                WriteFailure("FailureSharedFoldersRender_RenderErrors");
                WriteDebugLog("FailureSharedFoldersRender", true, listRenderError);
            };
            this.TagSuccess = function() {
                WriteSuccess("SuccessSharedFoldersRender");
            };
        }
        function GroupListsWebPart() {
            this.TagStart = function() {
                WriteStart("StartGroupListsRender");
            };
            this.LogFailure = function(listRenderError) {
                WriteFailure("FailureGroupListsRender_RenderErrors");
                WriteDebugLog("FailureGroupListsRender", true, listRenderError);
            };
            this.TagSuccess = function() {
                WriteSuccess("SuccessGroupListsRender");
            };
        }
    };
    SPClientRenderer.RenderReplace = function(node, renderCtx) {
        if (node == null || renderCtx == null)
            return;
        SPClientRenderer._ExecuteRenderCallbacks(renderCtx, 'OnPreRender');
        var result = SPClientRenderer.RenderCore(renderCtx);
        var pNode = node.parentNode;

        if (pNode != null) {
            if (result != null && result != '') {
                var container = document.createElement("div");

                container.innerHTML = result;
                var cNodes = container.childNodes;

                while (cNodes.length > 0)
                    pNode.insertBefore(cNodes[0], node);
            }
            pNode.removeChild(node);
        }
        SPClientRenderer._ExecuteRenderCallbacks(renderCtx, 'OnPostRender');
    };
    SPClientRenderer._ExecuteRenderCallbacks = function(renderCtx, callbackType) {
        var templateExecContext = {
            Operation: callbackType
        };
        var fn = function() {
            return SPClientRenderer._ExecuteRenderCallbacksWorker(renderCtx, callbackType, templateExecContext);
        };

        return CallFunctionWithErrorHandling(fn, renderCtx, null, templateExecContext);
    };
    SPClientRenderer._ExecuteRenderCallbacksWorker = function(renderCtx, callbackType, templateExecContext) {
        if (!renderCtx || callbackType == null || callbackType == '')
            return;
        var renderCallbacks = renderCtx[callbackType];

        if (renderCallbacks == null)
            return;
        if (typeof renderCallbacks == "function") {
            templateExecContext.TemplateFunction = renderCallbacks;
            renderCallbacks(renderCtx);
        }
        else if (typeof renderCallbacks == "object") {
            var numCallbacks = renderCallbacks.length;

            if (numCallbacks && typeof numCallbacks == "number") {
                for (var n = 0; n < Number(numCallbacks); n++) {
                    if (typeof renderCallbacks[n] == "function") {
                        templateExecContext.TemplateFunction = renderCallbacks[n];
                        renderCallbacks[n](renderCtx);
                    }
                }
            }
        }
    };
    SPClientRenderer.RenderCore = function(renderCtx) {
        if (renderCtx == null)
            return '';
        renderCtx.RenderView = RenderView;
        renderCtx.RenderHeader = RenderHeader;
        renderCtx.RenderBody = RenderBody;
        renderCtx.RenderFooter = RenderFooter;
        renderCtx.RenderGroups = RenderGroups;
        renderCtx.RenderItems = RenderItems;
        renderCtx.RenderFields = RenderFields;
        renderCtx.RenderFieldByName = RenderFieldByName;
        return RenderView(renderCtx);
        function RenderView(rCtx) {
            return DoSingleTemplateRender(rCtx, 'View');
        }
        function RenderHeader(rCtx) {
            return DoSingleTemplateRender(rCtx, 'Header');
        }
        function RenderBody(rCtx) {
            return DoSingleTemplateRender(rCtx, 'Body');
        }
        function RenderFooter(rCtx) {
            return DoSingleTemplateRender(rCtx, 'Footer');
        }
        function ResolveTemplate(rCtx, component, level) {
            if (rCtx == null)
                return '';
            if (rCtx.ResolveTemplate != null && typeof rCtx.ResolveTemplate == "function")
                return rCtx.ResolveTemplate(rCtx, component, level);
            else
                return '';
        }
        function DoSingleTemplateRender(inCtx, tplTag) {
            if (inCtx == null)
                return '';
            var tpl = ResolveTemplate(inCtx, inCtx.ListData, tplTag);

            if (tpl == null || tpl == '') {
                var templates = inCtx.Templates;

                if (templates == null)
                    return '';
                tpl = templates[tplTag];
            }
            if (tpl == null || tpl == '')
                return '';
            return CoreRender(tpl, inCtx);
        }
        function RenderGroups(inCtx) {
            if (inCtx == null || inCtx.ListData == null)
                return '';
            var groupTpls = null;

            if (inCtx.Templates != null)
                groupTpls = inCtx.Templates['Group'];
            var listData = inCtx.ListData;
            var groupData = listData[GetGroupsKey(inCtx)];
            var gStr = '';

            if (groupData == null) {
                if (typeof groupTpls == "string" || typeof groupTpls == "function") {
                    inCtx['CurrentGroupIdx'] = 0;
                    inCtx['CurrentGroup'] = listData;
                    inCtx['CurrentItems'] = listData[GetItemsKey(inCtx)];
                    gStr += CoreRender(groupTpls, inCtx);
                    inCtx['CurrentItems'] = null;
                    inCtx['CurrentGroup'] = null;
                }
                return gStr;
            }
            for (var rg_g = 0; rg_g < groupData.length; rg_g++) {
                var groupInfo = groupData[rg_g];
                var tpl = ResolveTemplate(inCtx, groupInfo, 'Group');

                if (tpl == null || tpl == '') {
                    if (groupTpls == null || groupTpls == {})
                        return '';
                    if (typeof groupTpls == "string" || typeof groupTpls == "function")
                        tpl = groupTpls;
                    if (tpl == null || tpl == '') {
                        var groupType = groupInfo['GroupType'];

                        tpl = groupTpls[groupType];
                    }
                }
                if (tpl == null || tpl == '')
                    continue;
                inCtx['CurrentGroupIdx'] = rg_g;
                inCtx['CurrentGroup'] = groupInfo;
                inCtx['CurrentItems'] = groupInfo[GetItemsKey(inCtx)];
                gStr += CoreRender(tpl, inCtx);
                inCtx['CurrentGroup'] = null;
                inCtx['CurrentItems'] = null;
            }
            return gStr;
        }
        function RenderItems(inCtx) {
            if (inCtx == null || inCtx.ListData == null)
                return '';
            var itemTpls = null;

            if (inCtx.Templates != null)
                itemTpls = inCtx.Templates['Item'];
            var listData = inCtx.ListData;
            var itemData = inCtx['CurrentItems'];

            if (itemData == null)
                itemData = typeof inCtx['CurrentGroup'] != "undefined" ? inCtx['CurrentGroup'][GetItemsKey(inCtx)] : null;
            if (itemData == null) {
                var groups = listData[GetGroupsKey(inCtx)];

                itemData = typeof groups != "undefined" ? groups[GetItemsKey(inCtx)] : null;
            }
            if (itemData == null)
                return '';
            var iStr = '';

            for (var i = 0; i < itemData.length; i++) {
                var itemInfo = itemData[i];
                var tpl = ResolveTemplate(inCtx, itemInfo, 'Item');

                if (tpl == null || tpl == '') {
                    if (itemTpls == null || itemTpls == {})
                        return '';
                    if (typeof itemTpls == "string" || typeof itemTpls == "function")
                        tpl = itemTpls;
                    if (tpl == null || tpl == '') {
                        var itemType = itemInfo['ContentType'];

                        tpl = itemTpls[itemType];
                    }
                }
                if (tpl == null || tpl == '')
                    continue;
                inCtx['CurrentItemIdx'] = i;
                inCtx['CurrentItem'] = itemInfo;
                if (typeof inCtx['ItemRenderWrapper'] == "string") {
                    inCtx['ItemRenderWrapper'] == SPClientRenderer.ParseTemplateString(inCtx['ItemRenderWrapper'], inCtx);
                }
                if (typeof inCtx['ItemRenderWrapper'] == "function") {
                    var renderWrapper = inCtx['ItemRenderWrapper'];
                    var templateExecContext = {
                        TemplateFunction: renderWrapper,
                        Operation: "ItemRenderWrapper"
                    };
                    var renderWrapperFn = function() {
                        return renderWrapper(CoreRender(tpl, inCtx), inCtx, tpl);
                    };

                    iStr += CallFunctionWithErrorHandling(renderWrapperFn, inCtx, '', templateExecContext);
                }
                else {
                    iStr += CoreRender(tpl, inCtx);
                }
                inCtx['CurrentItem'] = null;
            }
            return iStr;
        }
        function RenderFields(inCtx) {
            if (inCtx == null || inCtx.Templates == null || inCtx.ListSchema == null || inCtx.ListData == null)
                return '';
            var item = inCtx['CurrentItem'];
            var fields = inCtx.ListSchema['Field'];
            var fieldTpls = inCtx.Templates['Fields'];

            if (item == null || fields == null || fieldTpls == null)
                return '';
            var fStr = '';

            for (var f in fields)
                fStr += ExecuteFieldRender(inCtx, fields[f]);
            return fStr;
        }
        function RenderFieldByName(inCtx, fName) {
            if (inCtx == null || inCtx.Templates == null || inCtx.ListSchema == null || inCtx.ListData == null || fName == null || fName == '')
                return '';
            var item = inCtx['CurrentItem'];
            var fields = inCtx.ListSchema['Field'];
            var fieldTpls = inCtx.Templates['Fields'];

            if (item == null || fields == null || fieldTpls == null)
                return '';
            if (typeof SPClientTemplates != 'undefined' && spMgr != null && inCtx.ControlMode == SPClientTemplates.ClientControlMode.View)
                return spMgr.RenderFieldByName(inCtx, fName, item, inCtx.ListSchema);
            for (var f in fields) {
                if (fields[f].Name == fName)
                    return ExecuteFieldRender(inCtx, fields[f]);
            }
            return '';
        }
        function ExecuteFieldRender(inCtx, fld) {
            var item = inCtx['CurrentItem'];
            var fieldTpls = inCtx.Templates['Fields'];
            var fldName = fld.Name;

            if (typeof item[fldName] == "undefined")
                return '';
            var tpl = '';

            if (fieldTpls[fldName] != null)
                tpl = fieldTpls[fldName];
            if (tpl == null || tpl == '')
                return '';
            inCtx['CurrentFieldValue'] = item[fldName];
            inCtx['CurrentFieldSchema'] = fld;
            var fStr = CoreRender(tpl, inCtx);

            inCtx['CurrentFieldValue'] = null;
            inCtx['CurrentFieldSchema'] = null;
            return fStr;
        }
        function GetGroupsKey(c) {
            var groupsKey = c.ListDataJSONGroupsKey;

            return typeof groupsKey != "string" || groupsKey == '' ? 'Groups' : groupsKey;
        }
        function GetItemsKey(c) {
            var itemsKey = c.ListDataJSONItemsKey;

            return typeof itemsKey != "string" || itemsKey == '' ? 'Items' : itemsKey;
        }
    };
    SPClientRenderer.CoreRender = CoreRender;
    SPClientRenderer.ParseTemplateString = function(templateStr, c) {
        var templateExecContext = {
            TemplateFunction: templateStr,
            Operation: "ParseTemplateString"
        };
        var fn = function() {
            return SPClientRenderer.ParseTemplateStringWorker(templateStr, c);
        };

        return CallFunctionWithErrorHandling(fn, c, null, templateExecContext);
    };
    SPClientRenderer.ParseTemplateStringWorker = function(templateStr, c) {
        if (templateStr == null || templateStr.length == 0)
            return null;
        var strFunc = "var p=[]; p.push('" + ((((((((((templateStr.replace(/[\r\t\n]/g, " ")).replace(/'(?=[^#]*#>)/g, "\t")).split("'")).join("\\'")).split("\t")).join("'")).replace(/<#=(.+?)#>/g, "',$1,'")).split("<#")).join("');")).split("#>")).join("p.push('") + "'); return p.join('');";
        var func;

        func = new Function("ctx", strFunc);
        return func;
    };
    SPClientRenderer.ReplaceUrlTokens = function(tokenUrl) {
        if (ListModule.Settings.SupportsUrlTokenReplacement) {
            var pageContextInfo = window['_spPageContextInfo'];

            if (tokenUrl == null || tokenUrl == '' || pageContextInfo == null)
                return '';
            var siteToken = '~site/';
            var siteCollectionToken = '~sitecollection/';
            var siteCollectionMPGalleryToken = '~sitecollectionmasterpagegallery/';
            var lowerCaseTokenUrl = tokenUrl.toLowerCase();

            if (lowerCaseTokenUrl.indexOf(siteToken) == 0) {
                var sPrefix = DeterminePrefix(pageContextInfo.webServerRelativeUrl);

                tokenUrl = sPrefix + tokenUrl.substr(siteToken.length);
                lowerCaseTokenUrl = sPrefix + lowerCaseTokenUrl.substr(siteToken.length);
            }
            else if (lowerCaseTokenUrl.indexOf(siteCollectionToken) == 0) {
                var scPrefix = DeterminePrefix(pageContextInfo.siteServerRelativeUrl);

                tokenUrl = scPrefix + tokenUrl.substr(siteCollectionToken.length);
                lowerCaseTokenUrl = scPrefix + lowerCaseTokenUrl.substr(siteCollectionToken.length);
            }
            else if (lowerCaseTokenUrl.indexOf(siteCollectionMPGalleryToken) == 0) {
                var smpPrefix = DeterminePrefix(pageContextInfo.siteServerRelativeUrl);

                tokenUrl = smpPrefix + '_catalogs/masterpage/' + tokenUrl.substr(siteCollectionMPGalleryToken.length);
                lowerCaseTokenUrl = smpPrefix + '_catalogs/masterpage/' + lowerCaseTokenUrl.substr(siteCollectionMPGalleryToken.length);
            }
            var lcidToken = '{lcid}';
            var localeToken = '{locale}';
            var siteClientTagToken = '{siteclienttag}';
            var tokenIdx = -1;

            while ((tokenIdx = lowerCaseTokenUrl.indexOf(lcidToken)) != -1) {
                tokenUrl = tokenUrl.substring(0, tokenIdx) + String(pageContextInfo.currentLanguage) + tokenUrl.substr(tokenIdx + lcidToken.length);
                lowerCaseTokenUrl = lowerCaseTokenUrl.replace(lcidToken, String(pageContextInfo.currentLanguage));
            }
            while ((tokenIdx = lowerCaseTokenUrl.indexOf(localeToken)) != -1) {
                tokenUrl = tokenUrl.substring(0, tokenIdx) + pageContextInfo.currentUICultureName + tokenUrl.substr(tokenIdx + localeToken.length);
                lowerCaseTokenUrl = lowerCaseTokenUrl.replace(localeToken, pageContextInfo.currentUICultureName);
            }
            while ((tokenIdx = lowerCaseTokenUrl.indexOf(siteClientTagToken)) != -1) {
                tokenUrl = tokenUrl.substring(0, tokenIdx) + pageContextInfo.siteClientTag + tokenUrl.substr(tokenIdx + siteClientTagToken.length);
                lowerCaseTokenUrl = lowerCaseTokenUrl.replace(siteClientTagToken, pageContextInfo.siteClientTag);
            }
            return tokenUrl;
        }
        return "";
        function DeterminePrefix(contextInfoValue) {
            if (contextInfoValue == null || contextInfoValue == '')
                return '';
            var valueLen = contextInfoValue.length;

            return contextInfoValue[valueLen - 1] == '/' ? contextInfoValue : contextInfoValue + '/';
        }
    };
    SPClientRenderer.AddPostRenderCallback = AddPostRenderCallback;
    if (typeof window["Renderer"] == "undefined") {
        var Renderer = function() {
            var _this = this;
            var _id = Renderer.FunctionDispatcher.GetNextId();
            var _templates = {};

            this._GetId = function() {
                return _id;
            };
            this._GetTemplate = function(templateName) {
                return _templates[templateName];
            };
            this.SetTemplate = function(templateName, template) {
                if (typeof template == "undefined" || template == null)
                    delete _templates[templateName];
                else
                    _templates[templateName] = template;
            };
            this.RegisterHandler = function(handlerName, handler) {
                Renderer.FunctionDispatcher.RegisterFunction(_id, handlerName, handler);
            };
            this.UnregisterHandler = function(handlerName, handler) {
                return Renderer.FunctionDispatcher.UnregisterFunction(_id, handlerName, handler);
            };
            this.Render = function(templateName, data) {
                if (templateName in _templates) {
                    return Renderer.Engine.Render(templateName, data, _this);
                }
                else {
                    throw new Error("No template with name " + templateName);
                }
            };
        };

        Renderer.Engine = new (function() {
            var compiler_v1 = new Compiler_v1();
            var compiler_v2 = new Compiler_v2();

            this.Render = function(templateName, data, renderer) {
                return executeTemplate(templateName, data, renderer);
            };
            function executeTemplate(templateName, data, renderer) {
                var executingTemplate;
                var template = renderer._GetTemplate(templateName);

                if (typeof template === "function") {
                    executingTemplate = template;
                }
                else if (typeof template === "string") {
                    executingTemplate = compileTemplate(template);
                    renderer.SetTemplate(templateName, executingTemplate);
                }
                else {
                    throw new Error("Template with name " + templateName + " invalid");
                }
                var result = executingTemplate(data, renderer);

                return result;
            }
            function compileTemplate(templateContents) {
                if (!Boolean(templateContents)) {
                    return function(a, b) {
                        return "";
                    };
                }
                var searchIndex = templateContents.search(/^\s*\{%version/i);

                if (searchIndex != 0) {
                    return compiler_v1.Compile(templateContents);
                }
                else {
                    var lBrace = templateContents.indexOf("{");
                    var rBrace = templateContents.indexOf("}", lBrace);

                    if (rBrace < 0) {
                        throw new Error("Template Syntax Error! {%version} ending brace expected, but none found");
                    }
                    var version = (templateContents.slice(lBrace + "{%version".length, rBrace)).trim();
                    var templateStr = templateContents.slice(rBrace + 1);

                    if (version == "2.0") {
                        return compiler_v2.Compile(templateStr);
                    }
                    else {
                        throw new Error("Template Syntax Error! Invalid Version number");
                    }
                }
            }
            function Compiler_v1() {
                this.Compile = function(templateStr) {
                    var strFunc = "var p=[]; p.push('" + ((((((((((templateStr.replace(/[\r\t\n]/g, " ")).replace(/'(?=[^#]*#>)/g, "\t")).split("'")).join("\\'")).split("\t")).join("'")).replace(/<#=(.+?)#>/g, "',$1,'")).split("<#")).join("');")).split("#>")).join("p.push('") + "'); return p.join('');";
                    var func;

                    func = new Function("ctx", "renderer", strFunc);
                    return func;
                };
            }
            function Compiler_v2() {
                var _operationClosuresMap = {
                    "comment": commentOperation,
                    "value": valueOperation,
                    "template": templateOperation,
                    "foreach": foreachOperation,
                    "templateselect": templateSelectOperation,
                    "handler": handlerOperation,
                    "templatechoice": templateSelectOperation
                };

                this.Compile = function(templateStr) {
                    var operations = [];

                    templateStr = replaceConstructShortForms(templateStr);
                    var start;
                    var after = 0;

                    while ((start = findIndexOfNextConstruct(templateStr, after)) >= 0) {
                        if (start > after) {
                            operations.push(stringOperation(templateStr.slice(after, start)));
                        }
                        var end = templateStr.indexOf("}", start);

                        if (end < 0) {
                            throw new Error("Template Syntax Error! Ending brace expected, but none found.");
                        }
                        after = end + 1;
                        var constructStr = templateStr.slice(start, end);
                        var parts = parseConstruct(constructStr);
                        var constructName = parts[0].toLowerCase();

                        parts.shift();
                        if (constructName in _operationClosuresMap) {
                            var op = _operationClosuresMap[constructName].apply(this, parts);

                            operations.push(op);
                        }
                        else {
                            throw new Error("Template Syntax Error! Invalid construct: " + constructStr);
                        }
                    }
                    if (after < templateStr.length) {
                        operations.push(stringOperation(templateStr.slice(after)));
                    }
                    return function Template(data, renderer) {
                        var result = [];

                        for (var i = 0, count = operations.length; i < count; i++)
                            operations[i](data, renderer, result);
                        return result.join("");
                    };
                };
                function parseConstruct(constructStr) {
                    if (constructStr.charAt(constructStr.length - 1) == "}")
                        constructStr = constructStr.slice(0, -1);
                    constructStr = constructStr.slice("{%".length);
                    constructStr = constructStr.trim();
                    var parts = constructStr.split(/\s+/);

                    if (parts[0] == "") {
                        throw new Error("Template Syntax Error! Empty construct");
                    }
                    return parts;
                }
                function replaceConstructShortForms(templateStr) {
                    var result = templateStr;

                    result = result.replace(/{\/\//g, "{%comment ");
                    result = result.replace(/{=/g, "{%value ");
                    result = result.replace(/{\+/g, "{%handler ");
                    return result;
                }
                function findIndexOfNextConstruct(templateStr, startIndex) {
                    return templateStr.indexOf("{%", startIndex);
                }
                function getValueAtPath(data, path) {
                    if (!Boolean(path) || path == ".")
                        return data;
                    if (path.charAt(0) == "/") {
                        data = window;
                    }
                    var parts = path.split("/");

                    for (var i = 0, count = parts.length; i < count; i++) {
                        if (parts[i] == "" || parts[i] == ".")
                            continue;
                        if (data != null && typeof data[parts[i]] != "undefined")
                            data = data[parts[i]];
                        else
                            return null;
                    }
                    return data;
                }
                function stringOperation(string) {
                    return function StringOperation(data, renderer, result) {
                        result.push(string);
                    };
                }
                function commentOperation() {
                    return function CommentOperation(data, renderer, result) {
                    };
                }
                function valueOperation(path) {
                    if (arguments.length > 1)
                        throw new Error("Template Syntax Error! Value construct expected 0-1 parameters, but " + String(arguments.length) + " given");
                    if (!Boolean(path))
                        path = ".";
                    return function ValueOperation(data, renderer, result) {
                        var value = getValueAtPath(data, path);

                        result.push(value);
                    };
                }
                function templateOperation(templateName, path) {
                    if (arguments.length == 0 || arguments.length > 2)
                        throw new Error("Template Syntax Error! Template construct expected 1-2 parameters, but " + String(arguments.length) + " given");
                    if (!Boolean(path))
                        path = ".";
                    return function TemplateOperation(data, renderer, result) {
                        var value = getValueAtPath(data, path);

                        result.push(renderer.Render(templateName, value));
                    };
                }
                function foreachOperation(templateName, path) {
                    if (arguments.length == 0 || arguments.length > 2)
                        throw new Error("Template Syntax Error! Foreach construct expected 1-2 parameters, but " + String(arguments.length) + " given");
                    if (!Boolean(path))
                        path = ".";
                    return function ForeachOperation(data, renderer, result) {
                        var value = getValueAtPath(data, path);

                        if (Array.isArray(value)) {
                            var array = value;

                            for (var i = 0, count = array.length; i < count; i++) {
                                result.push(renderer.Render(templateName, array[i]));
                            }
                        }
                        else {
                            throw new Error("Foreach Operation expected an array, but no array given");
                        }
                    };
                }
                function templateSelectOperation(templatePath, dataPath) {
                    if (arguments.length == 0 || arguments.length > 2)
                        throw new Error("Template Syntax Error! TemplateSelect construct expected 1-2 parameters, but " + String(arguments.length) + " given");
                    if (!Boolean(dataPath))
                        dataPath = ".";
                    return function TemplateSelectOperation(data, renderer, result) {
                        var templateName = getValueAtPath(data, templatePath);

                        if (typeof templateName == "string") {
                            var value = getValueAtPath(data, dataPath);

                            result.push(renderer.Render(templateName, value));
                        }
                        else {
                            throw new Error("TemplateSelect Operation expected a string for template name, but no string given");
                        }
                    };
                }
                function handlerOperation(handlerName) {
                    if (!Boolean(handlerName))
                        throw new Error("Template Syntax Error! Handler construct needs a function name");
                    var extraClosureArgs = [].slice.call(arguments, 1);

                    return function HandlerOperation(data, renderer, result) {
                        var parametersBuilder = [];

                        parametersBuilder.push("this");
                        parametersBuilder.push(renderer._GetId());
                        parametersBuilder.push("&quot;" + handlerName + "&quot;");
                        parametersBuilder.push("event");
                        for (var i = 0; i < extraClosureArgs.length; i++) {
                            var value = getValueAtPath(data, extraClosureArgs[i]);
                            var objId = Renderer.FunctionDispatcher.RegisterObject(value);

                            parametersBuilder.push("Renderer.FunctionDispatcher.GetObject(" + String(objId) + ")");
                        }
                        var string = "Renderer.FunctionDispatcher.Execute(" + parametersBuilder.join(",") + ")";

                        result.push(string);
                    };
                }
            }
        })();
        Renderer.FunctionDispatcher = new (function() {
            var _functions = [];
            var _objects = [];

            this.GetNextId = function() {
                var nextId = _functions.length;

                _functions.push(new Object());
                return nextId;
            };
            this.RegisterObject = function(obj) {
                var nextId = _objects.length;

                _objects.push(obj);
                return nextId;
            };
            this.GetObject = function(objId) {
                if (objId < 0 || objId >= _objects.length)
                    throw new Error("No object registered with id " + String(objId));
                return _objects[objId];
            };
            this.RegisterFunction = function(id, funcName, func) {
                if (id < 0 || id >= _functions.length)
                    throw new Error("No Renderer registered with id " + String(id));
                if (typeof func != "function")
                    throw new Error("RegisterFunction expected a function, but none given");
                if (!Boolean(_functions[id][funcName]))
                    _functions[id][funcName] = [];
                _functions[id][funcName].push(func);
            };
            this.UnregisterFunction = function(id, funcName, func) {
                if (id < 0 || id >= _functions.length)
                    throw new Error("No Renderer registered with id " + String(id));
                if (!Boolean(_functions[id][funcName]))
                    return false;
                var found = false;
                var funcIndex = _functions[id][funcName].indexOf(func);

                if (funcIndex != -1) {
                    _functions[id][funcName].splice(funcIndex, 1);
                    found = true;
                }
                if (_functions[id][funcName].length == 0)
                    delete _functions[id][funcName];
                return found;
            };
            this.Execute = function(thisObj, id, funcName) {
                if (id < 0 || id >= _functions.length)
                    throw new Error("No Renderer registered with id " + String(id));
                if (!Boolean(_functions[id][funcName]))
                    throw new Error("No function registered with name " + funcName + " for Renderer ID " + String(id));
                var args = [].slice.call(arguments, 3);
                var funcs = _functions[id][funcName];

                for (var i = 0; i < funcs.length; i++) {
                    var f = funcs[i];

                    if (i == 0 && funcs.length == 1)
                        return f.apply(thisObj, args);
                    else
                        f.apply(thisObj, args);
                }
            };
        })();
        window.Renderer = Renderer;
    }
    else {
        Renderer = window["Renderer"];
    }
    g_QCB_nextId = 1;
    SPClientTemplates = {};
    SPClientTemplates.FileSystemObjectType = {
        Invalid: -1,
        File: 0,
        Folder: 1,
        Web: 2
    };
    SPClientTemplates.ChoiceFormatType = {
        Dropdown: 0,
        Radio: 1
    };
    SPClientTemplates.ClientControlMode = {
        Invalid: 0,
        DisplayForm: 1,
        EditForm: 2,
        NewForm: 3,
        View: 4
    };
    SPClientTemplates.RichTextMode = {
        Compatible: 0,
        FullHtml: 1,
        HtmlAsXml: 2,
        ThemeHtml: 3
    };
    SPClientTemplates.UrlFormatType = {
        Hyperlink: 0,
        Image: 1
    };
    SPClientTemplates.DateTimeDisplayFormat = {
        DateOnly: 0,
        DateTime: 1,
        TimeOnly: 2
    };
    SPClientTemplates.DateTimeCalendarType = {
        None: 0,
        Gregorian: 1,
        Japan: 3,
        Taiwan: 4,
        Korea: 5,
        Hijri: 6,
        Thai: 7,
        Hebrew: 8,
        GregorianMEFrench: 9,
        GregorianArabic: 10,
        GregorianXLITEnglish: 11,
        GregorianXLITFrench: 12,
        KoreaJapanLunar: 14,
        ChineseLunar: 15,
        SakaEra: 16,
        UmAlQura: 23
    };
    SPClientTemplates.UserSelectionMode = {
        PeopleOnly: 0,
        PeopleAndGroups: 1
    };
    SPClientTemplates.PresenceIndicatorSize = {
        Bar_5px: "5",
        Bar_8px: "8",
        Square_10px: "10",
        Square_12px: "12"
    };
    SPClientTemplates.TemplateManager = {};
    SPClientTemplates.TemplateManager._TemplateOverrides = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.View = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.Header = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.Body = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.Footer = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.Group = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.Item = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.Fields = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.OnPreRender = {};
    SPClientTemplates.TemplateManager._TemplateOverrides.OnPostRender = {};
    SPClientTemplates.TemplateManager._RegisterDefaultTemplates = function(renderCtx) {
        if (!renderCtx || !renderCtx.Templates && !renderCtx.OnPreRender && !renderCtx.OnPostRender)
            return;
        var tempStruct = SPClientTemplates._defaultTemplates;

        SPClientTemplates.TemplateManager._RegisterTemplatesInternal(renderCtx, tempStruct);
    };
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides = function(renderCtx) {
        if (!renderCtx || !renderCtx.Templates && !renderCtx.OnPreRender && !renderCtx.OnPostRender)
            return;
        var tempStruct = SPClientTemplates.TemplateManager._TemplateOverrides;

        SPClientTemplates.TemplateManager._RegisterTemplatesInternal(renderCtx, tempStruct);
    };
    SPClientTemplates.TemplateManager._RegisterTemplatesInternal = function(renderCtx, registeredOverrides) {
        if (!renderCtx || !registeredOverrides || !renderCtx.Templates && !renderCtx.OnPreRender && !renderCtx.OnPostRender)
            return;
        var tmps = renderCtx.Templates != null ? renderCtx.Templates : {};
        var typeInfo = SPClientTemplates.Utility.ComputeRegisterTypeInfo(renderCtx);

        if (typeof renderCtx.OnPreRender != "undefined")
            tmps['OnPreRender'] = renderCtx.OnPreRender;
        if (typeof renderCtx.OnPostRender != "undefined")
            tmps['OnPostRender'] = renderCtx.OnPostRender;
        for (var tmplName in tmps) {
            switch (tmplName) {
            case 'Group':
            case 'Item':
                if (typeof tmps[tmplName] == "function" || typeof tmps[tmplName] == "string")
                    tmps[tmplName] = {
                        "__DefaultTemplate__": tmps[tmplName]
                    };
            case 'View':
            case 'Header':
            case 'Body':
            case 'Footer':
            case 'Fields':
            case 'OnPreRender':
            case 'OnPostRender':
                var bCallbackTag = tmplName == 'OnPreRender' || tmplName == 'OnPostRender';
                var bSingleTpl = tmplName == 'View' || tmplName == 'Header' || tmplName == 'Body' || tmplName == 'Footer';
                var bSetTpl = tmplName == 'Item' || tmplName == 'Group' || tmplName == 'Fields';
                var viewStyleTpls, listTpls;
                var tpls = registeredOverrides[tmplName];

                if (typeInfo.defaultViewStyle) {
                    if (!tpls['default'])
                        tpls['default'] = {};
                    viewStyleTpls = tpls['default'];
                    HandleListTemplates();
                }
                else {
                    for (var vsIdx = 0; vsIdx < typeInfo.viewStyle.length; vsIdx++) {
                        var viewStyleKey = typeInfo.viewStyle[vsIdx];

                        if (!tpls[viewStyleKey])
                            tpls[viewStyleKey] = {};
                        viewStyleTpls = tpls[viewStyleKey];
                        HandleListTemplates();
                    }
                }
            }
        }
        function HandleListTemplates() {
            if (typeInfo.allLists) {
                if (!viewStyleTpls['all'])
                    viewStyleTpls['all'] = {};
                listTpls = viewStyleTpls['all'];
                if (bSingleTpl || bSetTpl)
                    HandleTemplateRegistration();
                else
                    HandleCallbackRegistration();
            }
            else {
                for (var ltIdx = 0; ltIdx < typeInfo.ltype.length; ltIdx++) {
                    var ltypeKey = typeInfo.ltype[ltIdx];

                    if (!viewStyleTpls[ltypeKey])
                        viewStyleTpls[ltypeKey] = {};
                    listTpls = viewStyleTpls[ltypeKey];
                }
                if (bSingleTpl || bSetTpl)
                    HandleTemplateRegistration();
                else
                    HandleCallbackRegistration();
            }
        }
        function HandleTemplateRegistration() {
            var viewSet = typeInfo.allViews ? listTpls['all'] : listTpls[typeInfo.viewId];
            var newTpls = tmps[tmplName];

            if (bSingleTpl) {
                if (typeof newTpls == "function" || typeof newTpls == "string")
                    viewSet = newTpls;
            }
            else {
                if (!viewSet)
                    viewSet = {};
                for (var t in newTpls)
                    viewSet[t] = newTpls[t];
            }
            if (typeInfo.allViews)
                listTpls['all'] = viewSet;
            else
                listTpls[typeInfo.viewId] = viewSet;
        }
        function HandleCallbackRegistration() {
            var newCallbacks = tmps[tmplName];

            if (!newCallbacks)
                return;
            var viewCallbacks = typeInfo.allViews ? listTpls['all'] : listTpls[typeInfo.viewId];

            if (!viewCallbacks)
                viewCallbacks = [];
            if (typeof newCallbacks == "function")
                viewCallbacks.push(newCallbacks);
            else {
                var newLen = newCallbacks.length;

                if (typeof newLen == "number") {
                    for (var n = 0; n < Number(newLen); n++) {
                        if (typeof newCallbacks[n] == "function")
                            viewCallbacks.push(newCallbacks[n]);
                    }
                }
            }
            if (typeInfo.allViews)
                listTpls['all'] = viewCallbacks;
            else
                listTpls[typeInfo.viewId] = viewCallbacks;
        }
    };
    SPClientTemplates.TemplateManager.GetTemplates = function(renderCtx) {
        if (!renderCtx)
            renderCtx = {};
        if (!renderCtx.Templates)
            renderCtx.Templates = {};
        var registeredOverrides = SPClientTemplates.TemplateManager._TemplateOverrides;
        var typeInfo = SPClientTemplates.Utility.ComputeResolveTypeInfo(renderCtx);

        ResolveRenderCallbacks();
        var tmp = {};

        tmp.View = ResolveSingleTemplate('View');
        tmp.Header = ResolveSingleTemplate('Header');
        tmp.Body = ResolveSingleTemplate('Body');
        tmp.Footer = ResolveSingleTemplate('Footer');
        tmp.Group = ResolveGroupTemplates();
        tmp.Item = ResolveItemTemplates();
        tmp.Fields = ResolveFieldTemplates();
        return tmp;
        function ResolveSingleTemplate(tag) {
            var tplOverrides = registeredOverrides[tag];
            var tplDefaults = SPClientTemplates._defaultTemplates[tag];
            var result = null;

            if (!typeInfo.defaultViewStyle) {
                result = ResolveSingleTemplateByViewStyle(tplOverrides[typeInfo.viewStyle], tag);
                if (result == null)
                    result = ResolveSingleTemplateByViewStyle(tplDefaults[typeInfo.viewStyle], tag);
            }
            if (result == null)
                result = ResolveSingleTemplateByViewStyle(tplOverrides['default'], tag);
            if (result == null)
                result = ResolveSingleTemplateByViewStyle(tplDefaults['default'], tag);
            if (result == null)
                result = GetSimpleSPTemplateByTag(tag);
            return result;
        }
        function ResolveSingleTemplateByViewStyle(vsOverride, tag) {
            if (typeof vsOverride == "undefined")
                return null;
            var result = CheckView(vsOverride[typeInfo.ltype], typeInfo.viewId);

            if (result == null)
                result = CheckView(vsOverride['all'], typeInfo.viewId);
            return result;
        }
        function ResolveGroupTemplates() {
            var resultSet = {};
            var tTag = 'Group';
            var keyIdx = tTag + 'Keys';
            var templateKeys = renderCtx[keyIdx];

            if (templateKeys == null || templateKeys.length == 0)
                templateKeys = ["__DefaultTemplate__"];
            for (var i in templateKeys) {
                var iKey = templateKeys[i];

                if (!resultSet[iKey]) {
                    var result = ResolveTemplateByKey(tTag, iKey);

                    if (iKey == "__DefaultTemplate__")
                        return result;
                    resultSet[iKey] = result;
                }
            }
            return resultSet;
        }
        function ResolveItemTemplates() {
            var resultSet = {};
            var itemKey = GetItemsKey(renderCtx);

            if (renderCtx.ListData == null || renderCtx.ListData[itemKey] == null)
                return ResolveTemplateByKey("Item", "__DefaultTemplate__");
            var knownContentTypes = {};
            var knownContentTypeCount = 0;
            var allItems = renderCtx.ListData[itemKey];
            var numItems = allItems.length;

            for (var i = 0; i < numItems; i++) {
                var item = allItems[i];

                if (item != null) {
                    var contentType = item['ContentType'];

                    if (contentType != null && typeof knownContentTypes[contentType] == 'undefined') {
                        knownContentTypeCount++;
                        knownContentTypes[contentType] = true;
                    }
                }
            }
            if (knownContentTypeCount == 0)
                return ResolveTemplateByKey("Item", "__DefaultTemplate__");
            var knownItemTemplatesDict = {};
            var knownItemTemplatesArray = [];

            for (var cType in knownContentTypes) {
                var currentTemplate = ResolveTemplateByKey('Item', cType);

                resultSet[cType] = currentTemplate;
                if (typeof knownItemTemplatesDict[currentTemplate] == 'undefined') {
                    knownItemTemplatesArray.push(currentTemplate);
                    knownItemTemplatesDict[currentTemplate] = true;
                }
            }
            if (knownItemTemplatesArray.length == 1)
                return knownItemTemplatesArray[0];
            return resultSet;
        }
        function ResolveFieldTemplates() {
            var resultSet = {};
            var registeredFieldTypes = {};
            var knownFieldModes = renderCtx.FieldControlModes != null ? renderCtx.FieldControlModes : {};
            var defaultFieldMode = typeof renderCtx.ControlMode != "undefined" ? renderCtx.ControlMode : SPClientTemplates.ClientControlMode.View;

            if (renderCtx.ListSchema == null || renderCtx.ListSchema.Field == null)
                return resultSet;
            var allFields = renderCtx.ListSchema.Field;
            var numFields = allFields.length;

            for (var f = 0; f < numFields; f++) {
                var fld = allFields[f];

                if (fld != null) {
                    var fldName = fld['Name'];
                    var fldType = fld['FieldType'];
                    var fldKnownParentType = fld['Type'];
                    var fldMode = knownFieldModes[fldName] != null ? knownFieldModes[fldName] : defaultFieldMode;
                    var fldModeStr = SPClientTemplates.Utility.ControlModeToString(fldMode);
                    var regOverride = GetRegisteredOverride('Fields', fldName, fldModeStr);

                    if (regOverride != null) {
                        resultSet[fldName] = regOverride;
                    }
                    else {
                        if (typeof registeredFieldTypes[fldType] != "undefined" && typeof registeredFieldTypes[fldType][fldModeStr] != "undefined") {
                            resultSet[fldName] = registeredFieldTypes[fldType][fldModeStr];
                        }
                        else {
                            var fldTmpl = GetRegisteredOverrideOrDefault('Fields', fldType, fldModeStr);

                            if (fldTmpl == null)
                                fldTmpl = ResolveTemplateByKey('Fields', fldKnownParentType, fldModeStr);
                            resultSet[fldName] = fldTmpl;
                            if (!registeredFieldTypes[fldType])
                                registeredFieldTypes[fldType] = {};
                            registeredFieldTypes[fldType][fldModeStr] = fldTmpl;
                        }
                    }
                }
            }
            return resultSet;
        }
        function ResolveTemplateByKey(tagName, tempKey, fieldMode) {
            var result = GetRegisteredOverrideOrDefault(tagName, tempKey, fieldMode);

            if (result == null)
                result = GetSimpleSPTemplateByTag(tagName, fieldMode);
            return result;
        }
        function ResolveTemplateKeyByViewStyle(vsOverride, tempKey, fieldMode) {
            if (typeof vsOverride == "undefined")
                return null;
            var result = CheckType(vsOverride[typeInfo.ltype], typeInfo.viewId, tempKey, fieldMode);

            if (result == null)
                result = CheckType(vsOverride['all'], typeInfo.viewId, tempKey, fieldMode);
            return result;
        }
        function GetRegisteredOverride(tagName, tempKey, fieldMode) {
            var tplOverrides = registeredOverrides[tagName];
            var result = null;

            if (!typeInfo.defaultViewStyle)
                result = ResolveTemplateKeyByViewStyle(tplOverrides[typeInfo.viewStyle], tempKey, fieldMode);
            if (result == null)
                result = ResolveTemplateKeyByViewStyle(tplOverrides['default'], tempKey, fieldMode);
            return result;
        }
        function GetRegisteredOverrideOrDefault(tagName, tempKey, fieldMode) {
            var tplOverrides = registeredOverrides[tagName];
            var tplDefaults = SPClientTemplates._defaultTemplates[tagName];
            var result = null;

            if (!typeInfo.defaultViewStyle) {
                result = ResolveTemplateKeyByViewStyle(tplOverrides[typeInfo.viewStyle], tempKey, fieldMode);
                if (result == null)
                    result = ResolveTemplateKeyByViewStyle(tplDefaults[typeInfo.viewStyle], tempKey, fieldMode);
            }
            if (result == null)
                result = ResolveTemplateKeyByViewStyle(tplOverrides['default'], tempKey, fieldMode);
            if (result == null)
                result = ResolveTemplateKeyByViewStyle(tplDefaults['default'], tempKey, fieldMode);
            return result;
        }
        function CheckType(viewOverrides, viewId, key, fMode) {
            var result = null;
            var overrides = CheckView(viewOverrides, viewId);

            if (overrides != null) {
                if (typeof overrides[key] != "undefined")
                    result = overrides[key];
                if (result == null && typeof overrides["__DefaultTemplate__"] != "undefined")
                    result = overrides["__DefaultTemplate__"];
            }
            if (result != null && typeof fMode != "undefined")
                result = result[fMode];
            return result;
        }
        function CheckView(listOverrides, viewId) {
            if (typeof listOverrides != "undefined") {
                if (typeof listOverrides[viewId] != "undefined")
                    return listOverrides[viewId];
                if (typeof listOverrides['all'] != "undefined" && viewId != 'Callout')
                    return listOverrides['all'];
            }
            return null;
        }
        function GetSimpleSPTemplateByTag(tplTag, fMode) {
            var result = null;

            switch (tplTag) {
            case 'View':
                result = RenderViewTemplate;
                break;
            case 'Header':
                result = '';
                break;
            case 'Body':
                result = RenderGroupTemplateDefault;
                break;
            case 'Footer':
                result = '';
                break;
            case 'Group':
                result = RenderItemTemplateDefault;
                break;
            case 'Item':
                result = RenderFieldTemplateDefault;
                break;
            case 'Fields':
                result = typeof SPFieldText_Edit == "function" && (fMode == 'NewForm' || fMode == 'EditForm') ? SPFieldText_Edit : RenderFieldValueDefault;
                break;
            }
            return result;
        }
        function ResolveRenderCallbacks() {
            var preRender = [], postRender = [];
            var regPreRender = registeredOverrides['OnPreRender'];
            var regPostRender = registeredOverrides['OnPostRender'];

            if (!typeInfo.defaultViewStyle) {
                CheckViewStyleCallbacks(preRender, regPreRender[typeInfo.viewStyle]);
                CheckViewStyleCallbacks(postRender, regPostRender[typeInfo.viewStyle]);
            }
            CheckViewStyleCallbacks(preRender, regPreRender['default']);
            CheckViewStyleCallbacks(postRender, regPostRender['default']);
            renderCtx.OnPreRender = preRender;
            renderCtx.OnPostRender = postRender;
        }
        function CheckViewStyleCallbacks(set, viewStyleCallbacks) {
            if (typeof viewStyleCallbacks != "undefined") {
                CheckListCallbacks(set, viewStyleCallbacks['all'], typeInfo.viewId);
                CheckListCallbacks(set, viewStyleCallbacks[typeInfo.ltype], typeInfo.viewId);
            }
        }
        function CheckListCallbacks(resSet, listCallbacks, viewId) {
            if (typeof listCallbacks != "undefined") {
                if (typeof listCallbacks['all'] != "undefined")
                    GetViewCallbacks(resSet, listCallbacks['all']);
                if (typeof listCallbacks[viewId] != "undefined")
                    GetViewCallbacks(resSet, listCallbacks[viewId]);
            }
        }
        function GetViewCallbacks(rSet, viewCallbacks) {
            if (typeof viewCallbacks != "undefined") {
                if (typeof viewCallbacks == "function")
                    rSet.push(viewCallbacks);
                else {
                    var newLen = viewCallbacks.length;

                    if (typeof newLen == "number") {
                        for (var n = 0; n < Number(newLen); n++) {
                            if (typeof viewCallbacks[n] == "function")
                                rSet.push(viewCallbacks[n]);
                        }
                    }
                }
            }
        }
        function GetItemsKey(c) {
            var itemsKey = c.ListDataJSONItemsKey;

            return typeof itemsKey != "string" || itemsKey == '' ? 'Items' : itemsKey;
        }
    };
    SPClientTemplates.Utility = {};
    SPClientTemplates.Utility.ComputeResolveTypeInfo = function(rCtx) {
        return new SPTemplateManagerResolveTypeInfo(rCtx);
    };
    SPTemplateManagerResolveTypeInfo_InitializePrototype();
    SPClientTemplates.Utility.ComputeRegisterTypeInfo = function(rCtx) {
        return new SPTemplateManagerRegisterTypeInfo(rCtx);
    };
    SPTemplateManagerRegisterTypeInfo_InitializePrototype();
    SPClientTemplates.Utility.ControlModeToString = function(mode) {
        var modeObj = SPClientTemplates.ClientControlMode;

        if (mode == modeObj.DisplayForm)
            return 'DisplayForm';
        if (mode == modeObj.EditForm)
            return 'EditForm';
        if (mode == modeObj.NewForm)
            return 'NewForm';
        if (mode == modeObj.View)
            return 'View';
        return 'Invalid';
    };
    SPClientTemplates.Utility.FileSystemObjectTypeToString = function(type) {
        var typeObj = SPClientTemplates.FileSystemObjectType;

        if (type == typeObj.File)
            return 'File';
        if (type == typeObj.Folder)
            return 'Folder';
        if (type == typeObj.Web)
            return 'Web';
        return 'Invalid';
    };
    SPClientTemplates.Utility.ChoiceFormatTypeToString = function(formatParam) {
        var formatObj = SPClientTemplates.ChoiceFormatType;

        if (formatParam == formatObj.Radio)
            return 'Radio';
        if (formatParam == formatObj.Dropdown)
            return 'DropDown';
        return 'Invalid';
    };
    SPClientTemplates.Utility.RichTextModeToString = function(mode) {
        var modeObj = SPClientTemplates.RichTextMode;

        if (mode == modeObj.Compatible)
            return 'Compatible';
        if (mode == modeObj.FullHtml)
            return 'FullHtml';
        if (mode == modeObj.HtmlAsXml)
            return 'HtmlAsXml';
        if (mode == modeObj.ThemeHtml)
            return 'ThemeHtml';
        return 'Invalid';
    };
    SPClientTemplates.Utility.IsValidControlMode = function(mode) {
        var modeObj = SPClientTemplates.ClientControlMode;

        return mode == modeObj.NewForm || mode == modeObj.EditForm || mode == modeObj.DisplayForm || mode == modeObj.View;
    };
    SPClientTemplates.Utility.Trim = function(str) {
        if (str == null || typeof str != 'string' || str.length == 0)
            return '';
        if (str.length == 1 && str.charCodeAt(0) == 160)
            return '';
        return (str.replace(/^\s\s*/, '')).replace(/\s\s*$/, '');
    };
    SPClientTemplates.Utility.InitContext = function(webUrl) {
        if (typeof SP != "undefined" && typeof SP.ClientContext != "undefined")
            return new SP.ClientContext(webUrl);
        return null;
    };
    SPClientTemplates.Utility.GetControlOptions = function(ctrlNode) {
        if (ctrlNode == null)
            return null;
        var result;
        var options = ctrlNode.getAttribute("data-sp-options");

        try {
            var script = "(function () { return " + options + "; })();";

            result = eval(script);
        }
        catch (e) {
            result = null;
        }
        return result;
    };
    SPClientTemplates.Utility.UserLookupDelimitString = ';#';
    SPClientTemplates.Utility.UserMultiValueDelimitString = ',#';
    SPClientTemplates.Utility.TryParseInitialUserValue = function(userStr) {
        var uValRes;

        if (userStr == null || userStr == '') {
            uValRes = '';
            return uValRes;
        }
        var lookupIdx = userStr.indexOf(SPClientTemplates.Utility.UserLookupDelimitString);

        if (lookupIdx == -1) {
            uValRes = userStr;
            return uValRes;
        }
        var userValues = userStr.split(SPClientTemplates.Utility.UserLookupDelimitString);

        if (userValues.length % 2 != 0) {
            uValRes = '';
            return uValRes;
        }
        uValRes = [];
        var v = 0;

        while (v < userValues.length) {
            var r = new SPClientFormUserValue();
            var allUserData = userValues[v++];

            allUserData += SPClientTemplates.Utility.UserLookupDelimitString;
            allUserData += userValues[v++];
            r.initFromUserString(allUserData);
            uValRes.push(r);
        }
        return uValRes;
    };
    SPClientTemplates.Utility.TryParseUserControlValue = function(userStr, separator) {
        var userArray = [];

        if (userStr == null || userStr == '')
            return userArray;
        var delimit = separator + ' ';
        var multipleUsers = userStr.split(delimit);

        if (multipleUsers.length == 0)
            return userArray;
        for (var v = 0; v < multipleUsers.length; v++) {
            var uStr = SPClientTemplates.Utility.Trim(multipleUsers[v]);

            if (uStr == '')
                continue;
            if (uStr.indexOf(SPClientTemplates.Utility.UserLookupDelimitString) != -1) {
                var r = new SPClientFormUserValue();

                r.initFromUserString(uStr);
                userArray.push(r);
            }
            else
                userArray.push(uStr);
        }
        return userArray;
    };
    SPClientTemplates.Utility.GetPropertiesFromPageContextInfo = function(rCtx) {
        if (rCtx == null)
            return;
        var info = window['_spPageContextInfo'];

        if (typeof info != "undefined") {
            rCtx.SiteClientTag = info.siteClientTag;
            rCtx.CurrentLanguage = info.currentLanguage;
            rCtx.CurrentCultureName = info.currentCultureName;
            rCtx.CurrentUICultureName = info.currentUICultureName;
        }
    };
    SPClientTemplates.Utility.ReplaceUrlTokens = function(tokenUrl) {
        return SPClientRenderer.ReplaceUrlTokens(tokenUrl);
    };
    SPClientFormUserValue_InitializePrototype();
    SPClientTemplates.Utility.ParseLookupValue = function(valueStr) {
        var lValue = {
            'LookupId': '0',
            'LookupValue': ''
        };

        if (valueStr == null || valueStr == '')
            return lValue;
        var delimitIdx = valueStr.indexOf(';#');

        if (delimitIdx == -1) {
            lValue.LookupId = valueStr;
            return lValue;
        }
        lValue.LookupId = valueStr.substr(0, delimitIdx);
        lValue.LookupValue = (valueStr.substr(delimitIdx + 2)).replace(/;;/g, ';');
        return lValue;
    };
    SPClientTemplates.Utility.ParseMultiLookupValues = function(valueStr) {
        if (valueStr == null || valueStr == '')
            return [];
        var valueArray = [];
        var valueLength = valueStr.length;
        var beginning = 0, end = 0;
        var bEscapeCharactersFound = false;

        while (end < valueLength) {
            if (valueStr[end] == ';') {
                if (++end >= valueLength)
                    break;
                if (valueStr[end] == '#') {
                    if (end - 1 > beginning) {
                        var foundValue = valueStr.substr(beginning, end - beginning - 1);

                        if (bEscapeCharactersFound)
                            foundValue = foundValue.replace(/;;/g, ';');
                        valueArray.push(foundValue);
                        bEscapeCharactersFound = false;
                    }
                    beginning = ++end;
                    continue;
                }
                else if (valueStr[end] == ';') {
                    end++;
                    bEscapeCharactersFound = true;
                    continue;
                }
                else
                    return [];
            }
            end++;
        }
        if (end > beginning) {
            var lastValue = valueStr.substr(beginning, end - beginning);

            if (bEscapeCharactersFound)
                lastValue = lastValue.replace(/;;/g, ';');
            valueArray.push(lastValue);
        }
        var resultArray = [];
        var resultLength = valueArray.length;

        for (var resultCount = 0; resultCount < resultLength; resultCount++)
            resultArray.push({
                'LookupId': valueArray[resultCount++],
                'LookupValue': valueArray[resultCount]
            });
        return resultArray;
    };
    SPClientTemplates.Utility.BuildLookupValuesAsString = function(choicesArray, isMultiLookup, setGroupDesc) {
        if (choicesArray == null || choicesArray.length == 0)
            return '';
        var choicesStr = '';
        var firstOption = true;

        for (var choiceIdx = 0; choiceIdx < choicesArray.length; choiceIdx++) {
            var curChoice = choicesArray[choiceIdx];

            if (!isMultiLookup) {
                if (!firstOption)
                    choicesStr += "|";
                firstOption = false;
                choicesStr += curChoice.LookupValue.replace(/\x7C/g, "||");
                choicesStr += "|";
                choicesStr += curChoice.LookupId;
            }
            else {
                if (!firstOption)
                    choicesStr += "|t";
                firstOption = false;
                choicesStr += curChoice.LookupId;
                choicesStr += "|t";
                choicesStr += curChoice.LookupValue.replace(/\x7C/g, "||");
                if (setGroupDesc)
                    choicesStr += "|t |t ";
            }
        }
        return choicesStr;
    };
    SPClientTemplates.Utility.ParseURLValue = function(valueStr) {
        var urlValue = {
            'URL': 'http://',
            'Description': ''
        };

        if (valueStr == null || valueStr == '')
            return urlValue;
        var idx = 0;

        while (idx < valueStr.length) {
            if (valueStr[idx] == ',') {
                if (idx == valueStr.length - 1) {
                    valueStr = valueStr.substr(0, valueStr.length - 1);
                    break;
                }
                else if (idx + 1 < valueStr.length && valueStr[idx + 1] == ' ') {
                    break;
                }
                else {
                    idx++;
                }
            }
            idx++;
        }
        if (idx < valueStr.length) {
            urlValue.URL = (valueStr.substr(0, idx)).replace(/\,\,/g, ',');
            var remainderLen = valueStr.length - (idx + 2);

            if (remainderLen > 0)
                urlValue.Description = valueStr.substr(idx + 2, remainderLen);
        }
        else {
            urlValue.URL = valueStr.replace(/\,\,/g, ',');
            urlValue.Description = valueStr.replace(/\,\,/g, ',');
        }
        return urlValue;
    };
    SPClientTemplates.Utility.GetFormContextForCurrentField = function(renderContext) {
        if (ListModule.Settings.SupportsForms) {
            if (renderContext == null || renderContext.FormContext == null)
                return null;
            var formCtx = new ClientFormContext(renderContext.FormContext);

            formCtx.fieldValue = renderContext.CurrentFieldValue;
            formCtx.fieldSchema = renderContext.CurrentFieldSchema;
            formCtx.fieldName = formCtx.fieldSchema != null ? formCtx.fieldSchema.Name : '';
            formCtx.controlMode = renderContext.ControlMode == null ? SPClientTemplates.ClientControlMode.Invalid : renderContext.ControlMode;
            return formCtx;
        }
        return null;
    };
    SPClientTemplates._defaultTemplates = {};
    SPClientTemplates._defaultTemplates['View'] = {
        'default': {
            'all': {}
        }
    };
    SPClientTemplates._defaultTemplates['Header'] = {
        'default': {
            'all': {}
        }
    };
    SPClientTemplates._defaultTemplates['Body'] = {
        'default': {
            'all': {}
        }
    };
    SPClientTemplates._defaultTemplates['Footer'] = {
        'default': {
            'all': {}
        }
    };
    SPClientTemplates._defaultTemplates['Group'] = {};
    SPClientTemplates._defaultTemplates['Item'] = {
        'default': {
            'all': {
                'Callout': {}
            }
        }
    };
    if (ListModule.Settings.SupportsCallouts) {
        SPClientTemplates._defaultTemplates['View']['default']['all']['Callout'] = CalloutRenderViewTemplate;
        SPClientTemplates._defaultTemplates['Header']['default']['all']['Callout'] = CalloutRenderHeaderTemplate;
        SPClientTemplates._defaultTemplates['Body']['default']['all']['Callout'] = CalloutRenderBodyTemplate;
        SPClientTemplates._defaultTemplates['Footer']['default']['all']['Callout'] = CalloutRenderFooterTemplate;
        SPClientTemplates._defaultTemplates['Item']['default']['all']['Callout']['__DefaultTemplate__'] = CalloutRenderItemTemplate;
    }
    SPClientTemplates._defaultTemplates['Fields'] = {};
    RenderBodyTemplate = function(renderCtx) {
        var itemTpls = renderCtx.Templates['Item'];

        if (itemTpls == null || itemTpls == {})
            return '';
        var listData = renderCtx.ListData;
        var listSchema = renderCtx.ListSchema;
        var bHasHeader = renderCtx.Templates.Header != '';
        var iStr = '';

        if (bHasHeader) {
            if (renderCtx.Templates.Header == null)
                iStr += RenderTableHeader(renderCtx);
            var aggregate = listSchema.Aggregate;

            if (aggregate != null && listData.Row.length > 0 && !listSchema.groupRender && !renderCtx.inGridMode)
                iStr += RenderAggregate(renderCtx, null, listData.Row[0], listSchema, null, true, aggregate);
            iStr += '<script id="scriptBody';
            iStr += renderCtx.wpq;
            iStr += '"></script>';
        }
        else {
            iStr = '<table onmousedown="return OnTableMouseDown(event);">';
        }
        if (renderCtx.inGridMode) {
            if (ListModule.Settings.SupportsInPlaceEdit) {
                if (!renderCtx.bInitialRender) {
                    iStr += RenderSPGridBody(renderCtx);
                }
            }
            return iStr;
        }
        var group1 = listSchema.group1;
        var group2 = listSchema.group2;
        var expand = listSchema.Collapse == null || listSchema.Collapse != "TRUE";
        var currCtx = typeof ctx != "undefined" ? ctx : renderCtx;
        var renderGroup = Boolean(currCtx.ExternalDataList);
        var ItemTpl = renderCtx.Templates['Item'];

        if (ItemTpl == null || ItemTpl == RenderFieldTemplateDefault || typeof ItemTpl != "function" && typeof ItemTpl != "string")
            ItemTpl = RenderItemTemplate;
        else if (typeof ItemTpl == "string")
            ItemTpl = SPClientRenderer.ParseTemplateString(ItemTpl, renderCtx);
        for (var idx = 0; idx < listData.Row.length; idx++) {
            var listItem = listData.Row[idx];

            if (idx == 0) {
                listItem.firstRow = true;
                if (group1 != null) {
                    iStr += '<input type="hidden" id="GroupByColFlag"/><input type="hidden" id="GroupByWebPartID';
                    iStr += renderCtx.ctxId;
                    iStr += '" webPartID="';
                    iStr += listSchema.View;
                    iStr += '"/><tbody id="GroupByCol';
                    iStr += listSchema.View;
                    iStr += '"><tr id="GroupByCol';
                    iStr += renderCtx.ctxId;
                    iStr += '" queryString ="';
                    iStr += listData.FilterLink;
                    iStr += '"/></tbody >';
                }
            }
            var itemType = listItem['ContentType'];
            var tpl = itemTpls[itemType];

            if (tpl == null || tpl == '') {
                tpl = ItemTpl;
            }
            else if (typeof tpl == 'string') {
                tpl = SPClientRenderer.ParseTemplateString(tpl, renderCtx);
                itemTpls[itemType] = tpl;
            }
            if (listSchema.group1 != null) {
                iStr += RenderGroup(renderCtx, listItem);
            }
            if (expand || renderGroup) {
                renderCtx.CurrentItem = listItem;
                renderCtx.CurrentItemIdx = idx;
                iStr += CoreRender(tpl, renderCtx);
                renderCtx.CurrentItem = null;
                renderCtx.CurrentItemIdx = -1;
            }
        }
        if (!bHasHeader) {
            iStr += '</table>';
        }
        if (ListModule.Settings.SupportsDelayLoading) {
            SPClientRenderer.AddPostRenderCallback(renderCtx, OnPostRenderTabularListView);
        }
        if (IsFileExtensionControlsSupported()) {
            AddPostRenderCallback(renderCtx, InitializeSuiteExtensions);
        }
        return iStr;
    };
    RenderItemTemplate = function(renderCtx) {
        var listItem = renderCtx.CurrentItem;
        var listSchema = renderCtx.ListSchema;
        var idx = renderCtx.CurrentItemIdx;
        var cssClass = idx % 2 == 1 ? "ms-alternating " : "";

        if (FHasRowHoverBehavior(renderCtx)) {
            cssClass += " ms-itmHoverEnabled ";
        }
        var ret = [];

        ret.push('<tr class="');
        ret.push(cssClass);
        if (listSchema.TabularView != undefined && listSchema.TabularView == "1") {
            ret.push('ms-itmhover');
            ret.push('" oncontextmenu="');
            if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(249) || !DoesListUseCallout(renderCtx)) {
                ret.push("return ShowCallOutOrECBWrapper(this, event, false)");
            }
            else {
                ret.push("return ShowCallOutOrECBWrapper(this, event, true)");
            }
        }
        ret.push('" iid="');
        var iid = GenerateIID(renderCtx);

        ret.push(iid);
        ret.push('" id="');
        ret.push(iid);
        ret.push('" role="row">');
        function SetInfiteScroll(curRet) {
            if (IsInfiniteScrollSupported(renderCtx) && renderCtx.ListData != null && idx == renderCtx.ListData.Row.length - 1) {
                curRet.push('" onfocus="scrollManager.ScrollHandler(this)');
            }
        }
        if (listSchema.TabularView != undefined && listSchema.TabularView == "1") {
            ret.push('<td class="ms-cellStyleNonEditable ms-vb-itmcbx ms-vb-imgFirstCell');
            SetInfiteScroll(ret);
            if (ListModule.Settings.SupportsDoclibAccessibility) {
                ret.push('" tabindex="0" role="rowheader" aria-label="' + Encoding.HtmlEncode(window["ListView"]["Strings"]["L_select_deselect_item_alt"]) + '"><div role="checkbox" class="s4-itm-cbx s4-itm-imgCbx" tabindex="-1');
            }
            else
                ret.push('" tabindex="0"><div role="checkbox" class="s4-itm-cbx s4-itm-imgCbx" tabindex="-1');
            if (BrowserDetection.userAgent.firefox)
                SetInfiteScroll(ret);
            if (ListModule.Settings.SupportsDoclibAccessibility) {
                ret.push('" aria-checked="false');
            }
            ret.push('"><span class="s4-itm-imgCbx-inner"><span class="ms-selectitem-span"><img class="ms-selectitem-icon" alt="" src="');
            ret.push(GetThemedImageUrl("spcommon.png"));
            ret.push('"/></span></span></div></td>');
        }
        var fields = listSchema ? listSchema.Field : null;

        for (var fldIdx = 0; fldIdx < fields.length; fldIdx++) {
            var field = fields[fldIdx];

            if (field.GroupField != null)
                break;
            ret.push('<td role="gridcell" class="');
            if (fldIdx == fields.length - 1 && field.CalloutMenu != 'TRUE' && field.listItemMenu != 'TRUE') {
                ret.push('ms-vb-lastCell ');
            }
            if (field.css == null) {
                field.css = GetCSSClassForFieldTd(renderCtx, field);
                if (field.CalloutMenu == 'TRUE' || field.ClassInfo == 'Menu' || field.listItemMenu == 'TRUE') {
                    field.css += '" IsECB="TRUE';
                    if (field.CalloutMenu == 'TRUE') {
                        field.css += '" IsCallOut="TRUE';
                    }
                    if (field.ClassInfo == 'Menu' || field.listItemMenu == 'TRUE') {
                        field.css += '" height="100%';
                    }
                }
            }
            renderCtx.CurrentFieldSchema = field;
            ret.push(field.css);
            ret.push('">');
            ret.push(spMgr.RenderField(renderCtx, field, listItem, listSchema));
            ret.push('</td>');
            renderCtx.CurrentFieldSchema = null;
        }
        ret.push('</tr>');
        return ret.join('');
    };
    RenderHeaderTemplate = function(renderCtx, fRenderHeaderColumnNames) {
        var listSchema = renderCtx.ListSchema;
        var listData = renderCtx.ListData;
        var ret = [];

        if (fRenderHeaderColumnNames == null) {
            fRenderHeaderColumnNames = true;
        }
        ret.push(RenderTableHeader(renderCtx));
        if (ListModule.Settings.SupportsDoclibAccessibility) {
            ret.push('<thead role="presentation" id="');
            ret.push("js-listviewthead-" + renderCtx.wpq);
            ret.push('"><tr valign="top" role="row" class="ms-viewheadertr');
        }
        else {
            ret.push('<thead id="');
            ret.push("js-listviewthead-" + renderCtx.wpq);
            ret.push('"><tr valign="top" class="ms-viewheadertr');
        }
        if (DOM.rightToLeft)
            ret.push(' ms-vhrtl');
        else
            ret.push(' ms-vhltr');
        ret.push('">');
        if (listSchema.TabularView != undefined && listSchema.TabularView == "1") {
            ret.push('<th class="ms-headerCellStyleIcon ms-vh-icon ms-vh-selectAllIcon" scope="col" role="columnheader">');
            RenderSelectAllCbx(renderCtx, ret);
            ret.push('</th>');
        }
        if (fRenderHeaderColumnNames) {
            var fields = listSchema ? listSchema.Field : null;
            var counter = 1;

            for (var f in fields) {
                var field = fields[f];

                if (field.DisplayName == null)
                    continue;
                if (field.GroupField != null)
                    break;
                field.counter = counter++;
                ret.push(spMgr.RenderHeader(renderCtx, field));
                if (IsCSRReadOnlyTabularView(renderCtx) && (field.CalloutMenu == "TRUE" || field.listItemMenu == "TRUE"))
                    ret.push('<th role="presentation"></th>');
            }
        }
        if (listSchema.TabularView == "1" && renderCtx.BasePermissions.ManageLists && renderCtx.ListTemplateType != 160) {
            ret.push('<th class="ms-vh-icon" scope="col" title=""><span class="ms-addcolumn-span" role="presentation"> </span></th>');
        }
        ret.push("</tr>");
        ret.push("</thead>");
        if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(146)) {
            WriteEngagementLog("SPPOP_DragAndDropAttract");
            WriteStart("SPPOP_DragAndDropAttractStart");
            if (ShouldShowDragDropAttractBox(renderCtx)) {
                ret.push('<caption class="ms-dragDropAttract"><div class="ms-attractMode ms-dragDropAttract ms-hideWhenFileDrag">' + window["ListView"]["Strings"]["L_SPDragAndDropAttract"] + '</div></caption>');
                WriteSuccess("SPPOP_DragAndDropAttractSuccess");
            }
            else {
                WriteFailure("SPPOP_DragAndDropAttractFail");
            }
        }
        else if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(178)) {
            WriteEngagementLog("SPPOP_DragAndDropAttractB");
            WriteStart("SPPOP_DragAndDropAttractBStart");
            if (ShouldShowDragDropAttractBox(renderCtx)) {
                ret.push('<caption class="ms-dragDropAttract"><div class="ms-metadata ms-dragDropAttract-subtle ms-hideWhenFileDrag">' + window["ListView"]["Strings"]["L_SPDragAndDropAttract"] + '</div></caption>');
                WriteSuccess("SPPOP_DragAndDropAttractBSuccess");
            }
            else {
                WriteFailure("SPPOP_DragAndDropAttractBFail");
            }
        }
        else if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(311)) {
            WriteEngagementLog("SPPOP_NoDragAndDropAttract");
        }
        else {
            WriteEngagementLog("SPPOP_DragAndDropAttractUserFlightError");
        }
        return ret.join('');
    };
    RenderFooterTemplate = function(renderCtx) {
        var ret = [];

        if (!(Flighting.VariantConfiguration.IsExpFeatureClientEnabled(146) || Flighting.VariantConfiguration.IsExpFeatureClientEnabled(178)) || !ShouldShowDragDropAttractBox(renderCtx)) {
            RenderEmptyText(ret, renderCtx);
        }
        RenderPaging(ret, renderCtx);
        return ret.join('');
    };
    RenderHeroParameters_InitializePrototype();
    if (typeof window.ComputedFieldWorker != "function") {
        window.ComputedFieldWorker = (function() {
            function NewGif(listItem, listSchema, ret) {
                if (listItem["Created_x0020_Date.ifnew"] == "1") {
                    var spCommonSrc = GetThemedImageUrl("spcommon.png");

                    ret.push("<span class=\"ms-newdocument-iconouter\"><img class=\"ms-newdocument-icon\" src=\"");
                    ret.push(spCommonSrc);
                    ret.push("\" alt=\"");
                    ret.push(window["ListView"]["Strings"]["L_SPClientNew"]);
                    ret.push("\" title=\"");
                    ret.push(window["ListView"]["Strings"]["L_SPClientNew"]);
                    ret.push("\" /></span>");
                }
            }
            function GenBlogLink(link, altText, position, titleText, descText, listSchema, listItem) {
                var ret = [];

                ret.push("<span style=\"vertical-align:middle\">");
                ret.push("<span style=\"height:16px;width:16px;position:relative;display:inline-block;overflow:hidden;\" class=\"s4-clust\"><a href=\"");
                ret.push(link);
                GenPostLink(ret, listSchema, listItem);
                ret.push("\" style=\"height:16px;width:16px;display:inline-block;\" ><img src=\"" + ListView.ImageBasePath + "/_layouts/15/images/fgimg.png?rev=44" + "\" alt=\"");
                ret.push(altText);
                ret.push("\" style=\"left:-0px !important;top:");
                ret.push(position);
                ret.push("px !important;position:absolute;\" title=\"");
                ret.push(titleText);
                ret.push("\" class=\"imglink\" longDesc=\"");
                ret.push(descText);
                ret.push("\"></a>");
                ret.push("</span>");
                ret.push("</span>");
                return ret.join('');
            }
            function GenPostLink(ret, listSchema, listItem) {
                ret.push(listSchema.HttpVDir);
                ret.push("/Lists/Posts/Post.aspx?ID=");
                ret.push(listItem.ID);
            }
            function GetFolderIconSourcePath(listItem) {
                if (listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"] == '')
                    return ListView.ImageBasePath + "/_layouts/15/images/folder.gif?rev=44";
                else
                    return ListView.ImageBasePath + "/_layouts/15/images/" + listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"];
            }
            function LinkFilenameNoMenuInternal(renderCtx, listItem, listSchema) {
                var guFlight = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(499);
                var ret = [];
                var fileUrl = listItem.FileRef;

                if (fileUrl != null && typeof fileUrl != 'undefined' && TrimSpaces(fileUrl) != "") {
                    if (listItem.FSObjType == '1') {
                        if (listSchema.IsDocLib == '1') {
                            RenderDocFolderLink(renderCtx, ret, listItem.FileLeafRef, listItem, listSchema);
                        }
                        else {
                            RenderListFolderLink(ret, listItem.FileLeafRef, listItem, listSchema);
                        }
                    }
                    else if (ListModule.Settings.SupportsAddToOneDrive && Boolean(IsMountPoint(listItem))) {
                        EnsureFileLeafRefName(listItem);
                        ret.push(RenderMountPointLink(renderCtx, ret, listItem["FileLeafRef.Name"], listItem, listSchema));
                    }
                    else if (ListModule.Settings.SupportsShortcutLink && Boolean(IsShortcutLink(listItem))) {
                        EnsureFileLeafRefName(listItem);
                        RenderShortcutLink(renderCtx, ret, listItem["FileLeafRef.Name"], listItem, listSchema);
                    }
                    else {
                        var fileRefHref = (Boolean(renderCtx.RealHttpRoot) ? ListModule.Util.getHostUrl(renderCtx.HttpRoot) : "") + listItem.FileRef;

                        if (guFlight) {
                            fileRefHref = Encoding.HtmlEncode(fileRefHref);
                        }
                        ret.push("<a class='ms-listlink' href=\"");
                        ret.push(fileRefHref);
                        ret.push("\" onmousedown=\"return VerifyHref(this,event,'");
                        ret.push(listSchema.DefaultItemOpen);
                        ret.push("','");
                        ret.push(listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapcon"]);
                        ret.push("','");
                        if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(90)) {
                            ret.push(Encoding.ScriptEncode(listItem["serverurl.progid"]));
                        }
                        else {
                            ret.push(listItem["serverurl.progid"]);
                        }
                        ret.push("')\" onclick=\"");
                        AddUIInstrumentationClickEvent(ret, listItem, 'Navigation');
                        if (IsFileHandlerForAllNonOfficeFilesSupported()) {
                            if (IsFileExtensionControlsSupported() && ShouldCallSuiteExtensionControlFactory(renderCtx)) {
                                ret.push("CoreInvoke('CallSuiteExtensionControlFactory', this, event, '");
                                ret.push(listItem["File_x0020_Type"]);
                                ret.push("','");
                                ret.push(renderCtx.HttpRoot);
                                ret.push("','");
                                ret.push(Encoding.ScriptEncode(listItem["FileRef"]));
                                ret.push("');");
                            }
                        }
                        else {
                            ret.push("CoreInvoke('CallSuiteExtensionControlFactory', this, event, '");
                            ret.push(listItem["File_x0020_Type"]);
                            ret.push("','");
                            ret.push(renderCtx.HttpRoot);
                            ret.push("','");
                            ret.push(Encoding.ScriptEncode(listItem["FileRef"]));
                            ret.push("');");
                        }
                        ret.push("return DispEx(this,event,'TRUE','FALSE','");
                        ret.push(listItem["File_x0020_Type.url"]);
                        ret.push("','");
                        ret.push(listItem["File_x0020_Type.progid"]);
                        ret.push("','");
                        ret.push(listSchema.DefaultItemOpen);
                        ret.push("','");
                        ret.push(listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapcon"]);
                        ret.push("','");
                        ret.push(listItem["HTML_x0020_File_x0020_Type"]);
                        ret.push("','");
                        if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(90)) {
                            ret.push(Encoding.ScriptEncode(listItem["serverurl.progid"]));
                        }
                        else {
                            ret.push(listItem["serverurl.progid"]);
                        }
                        ret.push("','");
                        ret.push(Boolean(listItem["CheckoutUser"]) ? listItem["CheckoutUser"][0].id : '');
                        ret.push("','");
                        ret.push(listSchema.Userid);
                        ret.push("','");
                        ret.push(listSchema.ForceCheckout);
                        ret.push("','");
                        ret.push(listItem.IsCheckedoutToLocal);
                        ret.push("','");
                        ret.push(listItem.PermMask);
                        var fileRef = listItem["FileLeafRef"];

                        if (fileRef != null) {
                            var index = fileRef.lastIndexOf('.');

                            fileRef = index >= 0 ? fileRef.substring(0, index) : fileRef;
                        }
                        if (ListModule.Settings.SupportsDoclibAccessibility) {
                            ret.push("')\"");
                            var ariaStr = fileRef + ", " + ariaLabelForFile(listItem["File_x0020_Type.mapapp"], listItem["File_x0020_Type"]);

                            ret.push(" aria-label='");
                            ret.push(Encoding.HtmlEncode(ariaStr));
                            ret.push("'>");
                        }
                        else {
                            ret.push("')\">");
                        }
                        ret.push(guFlight ? Encoding.HtmlEncode(fileRef) : fileRef);
                        ret.push("</a>");
                        NewGif(listItem, listSchema, ret);
                    }
                }
                else {
                    ret.push("<nobr>");
                    ret.push(guFlight ? Encoding.HtmlEncode(listItem["FileLeafRef"]) : listItem["FileLeafRef"]);
                    ret.push("</nobr>");
                }
                return ret.join('');
            }
            function RenderType(renderCtx, field, listItem, listSchema) {
                var ret = [];
                var guFlight = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(499);
                var fileLeafRef = guFlight ? Encoding.HtmlEncode(listItem.FileLeafRef) : listItem.FileLeafRef;
                var elementid = "imgIcon" + listItem["ID"] + renderCtx.wpq;
                var groupHeader = listItem["DocIcon.groupHeader"] === undefined ? false : true;

                if (groupHeader) {
                    elementid = "imgIcon" + renderCtx.ctxId + "-";
                    if (listItem["DocIcon.groupindex"]) {
                        elementid += listItem["DocIcon.groupindex"];
                    }
                    else if (listItem["DocIcon.groupindex2"]) {
                        var group1 = listSchema.group1;

                        elementid += listItem[group1 + ".groupindex"] + listItem["DocIcon.groupindex2"];
                    }
                }
                if (ListModule.Settings.SupportsAddToOneDrive && Boolean(IsMountPoint(listItem))) {
                    var mpInfo = MountPointInfo.createByListItem(listItem, renderCtx);

                    if (SupportAjaxFolderNav(renderCtx)) {
                        var webPartId = renderCtx.clvp != null ? renderCtx.clvp.WebPartId() : "";

                        ret.push("<a href=\"#\" onclick=\"");
                        ret.push("EnterFolderAjax(event, '");
                        ret.push(URI_Encoding.encodeURIComponent(listItem.FileRef));
                        ret.push("', '");
                        ret.push(mpInfo.getMountPointUrl());
                        ret.push("', true);return false;\"");
                        if (ListModule.Settings.SupportsDoclibAccessibility)
                            ret.push(" aria-label=\"" + Encoding.HtmlEncode(window["ListView"]["Strings"]["L_FieldType_SharedFolder"]) + "\">");
                        else
                            ret.push(">");
                    }
                    else {
                        ret.push("<a href=\"");
                        ret.push(mpInfo.getMountPointUrl());
                        if (ListModule.Settings.SupportsDoclibAccessibility)
                            ret.push(" aria-label=\"" + Encoding.HtmlEncode(window["ListView"]["Strings"]["L_FieldType_SharedFolder"]) + "\">");
                        else
                            ret.push("\">");
                    }
                    ret.push("<img border=\"0\" alt=\"");
                    ret.push(fileLeafRef);
                    ret.push("\" title=\"");
                    ret.push(fileLeafRef);
                    ret.push("\" src=\"");
                    ret.push(ListView.ImageBasePath + "/_layouts/15/images/SharedFolder16.png?rev=44");
                    ret.push("\" />");
                    ret.push("</a>");
                }
                else if (ListModule.Settings.SupportsShortcutLink && Boolean(IsShortcutLink(listItem))) {
                    EnsureFileLeafRefName(listItem);
                    RenderShortcutLinkIcon(renderCtx, ret, listItem["FileLeafRef.Name"], listItem, listSchema);
                }
                else if (listItem.FSObjType == '1') {
                    var strMaintainUserChrome = fMaintainUserChrome() ? "&MaintainUserChrome=true" : "";

                    if (hasPolicyTip()) {
                        appendPolicyTipIcon();
                    }
                    else {
                        ret.push("<a href=\"");
                        ret.push(listSchema.PagePath);
                        ret.push("?RootFolder=");
                        ret.push(URI_Encoding.encodeURIComponent(listItem.FileRef));
                        ret.push(listSchema.ShowWebPart);
                        ret.push("&FolderCTID=");
                        ret.push(listItem.ContentTypeId);
                        ret.push("&View=");
                        ret.push(URI_Encoding.encodeURIComponent(listSchema.View));
                        ret.push(strMaintainUserChrome);
                        ret.push("\" onmousedown=\"VerifyFolderHref(this, event, '");
                        ret.push(listItem["File_x0020_Type.url"]);
                        ret.push("','");
                        ret.push(listItem["File_x0020_Type.progid"]);
                        ret.push("','");
                        ret.push(listSchema.DefaultItemOpen);
                        ret.push("', '");
                        ret.push(listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapcon"]);
                        ret.push("', '");
                        ret.push(listItem["HTML_x0020_File_x0020_Type"]);
                        ret.push("', '");
                        if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(90)) {
                            ret.push(Encoding.ScriptEncode(listItem["serverurl.progid"]));
                        }
                        else {
                            ret.push(listItem["serverurl.progid"]);
                        }
                        ret.push("')\" onclick=\"");
                        AddUIInstrumentationClickEvent(ret, listItem, 'Navigation');
                        ret.push("return HandleFolder(this,event,'");
                        ret.push(listSchema.PagePath);
                        ret.push("?RootFolder=");
                        ret.push(URI_Encoding.encodeURIComponent(listItem.FileRef));
                        ret.push(listSchema.ShowWebPart);
                        ret.push("&FolderCTID=");
                        ret.push(listItem.ContentTypeId);
                        ret.push("&View=");
                        ret.push(URI_Encoding.encodeURIComponent(listSchema.View));
                        ret.push(strMaintainUserChrome);
                        ret.push("','TRUE','FALSE','");
                        ret.push(listItem["File_x0020_Type.url"]);
                        ret.push("','");
                        ret.push(listItem["File_x0020_Type.progid"]);
                        ret.push("','");
                        ret.push(listSchema.DefaultItemOpen);
                        ret.push("','");
                        ret.push(listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapcon"]);
                        ret.push("','");
                        ret.push(listItem["HTML_x0020_File_x0020_Type"]);
                        ret.push("','");
                        if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(90)) {
                            ret.push(Encoding.ScriptEncode(listItem["serverurl.progid"]));
                        }
                        else {
                            ret.push(listItem["serverurl.progid"]);
                        }
                        ret.push("','");
                        ret.push(Boolean(listItem["CheckoutUser"]) ? listItem["CheckoutUser"][0].id : '');
                        ret.push("','");
                        ret.push(listSchema.Userid);
                        ret.push("','");
                        ret.push(listSchema.ForceCheckout);
                        ret.push("','");
                        ret.push(listItem.IsCheckedoutToLocal);
                        ret.push("','");
                        ret.push(listItem.PermMask);
                        if (ListModule.Settings.SupportsDoclibAccessibility)
                            ret.push("');\" tabIndex=\"-1\" IsFolder=\"TRUE\" aria-label=\"" + Encoding.HtmlEncode(ariaLabelForFolder(listItem["File_x0020_Type.mapapp"], false)) + "\"><img border=\"0\" alt=\"");
                        else
                            ret.push("');\"><img border=\"0\" alt=\"");
                        ret.push(fileLeafRef);
                        ret.push("\" title=\"");
                        ret.push(fileLeafRef);
                        ret.push("\" src=\"");
                        ret.push(GetFolderIconSourcePath(listItem));
                        ret.push("\" />");
                        if (typeof listItem.IconOverlay != 'undefined' && listItem.IconOverlay != '') {
                            ret.push("<img width=\"16\" height=\"16\" src=\"" + ListView.ImageBasePath + "/_layouts/15/images/");
                            ret.push(listItem["IconOverlay.mapoly"]);
                            ret.push("\" class=\"ms-vb-icon-overlay\" alt=\"\" title=\"\" />");
                        }
                        ret.push("</a>");
                    }
                }
                else {
                    if (listSchema.IsDocLib == '1') {
                        if (typeof listItem.IconOverlay == 'undefined' || listItem.IconOverlay == '') {
                            var usingFileExtensionControls = false;
                            var alttext = null;
                            var notCheckedOut = typeof listItem["CheckoutUser"] == 'undefined' || listItem["CheckoutUser"] == '';
                            var blockDeleteByComplianceFlags = typeof listItem["_ComplianceFlags"] !== 'undefined' && listItem["_ComplianceFlags"] != null && (listItem["_ComplianceFlags"] & 1) == 1;

                            if (IsFileHandlerForAllNonOfficeFilesSupported()) {
                                renderCtx["allowedSuiteExtensionFileTypes"] = ["pdf"];
                                if (IsFileExtensionControlsSupported() && ShouldCallSuiteExtensionControlFactory(renderCtx)) {
                                    usingFileExtensionControls = true;
                                }
                            }
                            else {
                                renderCtx["allowedSuiteExtensionFileTypes"] = ["bmp", "chm", "gif", "htm", "html", "jpeg", "jpg", "pdf", "png", "psd", "tif", "txt", "wma", "wmv", "xml", "zip"];
                                if (IsFileExtensionControlsSupported() && typeof listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"] != 'undefined' && (listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"] == "" || IE8Support.arrayIndexOf(renderCtx["allowedSuiteExtensionFileTypes"], listItem["File_x0020_Type"], 0) > -1)) {
                                    usingFileExtensionControls = true;
                                }
                            }
                            if (hasPolicyTip()) {
                                appendPolicyTipIcon();
                            }
                            else if (notCheckedOut) {
                                alttext = ListModule.Settings.SupportsDoclibAccessibility ? ariaLabelForFile(listItem["File_x0020_Type.mapapp"], listItem["File_x0020_Type"]) : listItem.FileLeafRef;
                                var onclickHandler = Boolean(listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.isIconDynamic"]) ? ' onclick="this.style.display=\'none\';"' : '';

                                if (blockDeleteByComplianceFlags) {
                                    alttext = getComplianceBlockDeleteAltText();
                                }
                                appendDocIcon(alttext, listItem.FileLeafRef, true, listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"], onclickHandler);
                            }
                            else {
                                alttext = getCheckedOutAltText();
                                appendDocIcon(alttext, alttext, true, listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"]);
                            }
                            if (!groupHeader) {
                                if (!notCheckedOut || blockDeleteByComplianceFlags) {
                                    var iconoverlay = ListView.ImageBasePath + '/_layouts/15/images/checkoutoverlay.gif';

                                    alttext = getCheckedOutAltText();
                                    if (notCheckedOut && blockDeleteByComplianceFlags) {
                                        alttext = getComplianceBlockDeleteAltText();
                                        iconoverlay = ListView.ImageBasePath + '/_layouts/15/images/lockoverlay.png';
                                    }
                                    ret.push('<img src="' + iconoverlay + '" class="ms-vb-icon-overlay" alt="');
                                    ret.push(alttext);
                                    ret.push('" title="');
                                    ret.push(alttext);
                                    ret.push('" />');
                                }
                            }
                        }
                        else {
                            appendDocIcon(listItem["FileLeafRef"], listItem["FileLeafRef"], false, listItem["IconOverlay.mapico"]);
                            ret.push('<img width="16" height="16" src="' + ListView.ImageBasePath + '/_layouts/15/images/');
                            ret.push(listItem["IconOverlay.mapoly"]);
                            ret.push('" class="ms-vb-icon-overlay" alt="" title="" />');
                        }
                    }
                    else {
                        appendDocIcon(listItem["FileLeafRef"], listItem["FileLeafRef"], false, listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"]);
                    }
                }
                function getCheckedOutAltText() {
                    return listItem.FileLeafRef + "&#10;" + window["ListView"]["Strings"]["L_SPCheckedoutto"] + ": " + (Boolean(listItem["CheckoutUser"]) ? Encoding.HtmlEncode(listItem["CheckoutUser"][0].title) : '');
                }
                function getComplianceBlockDeleteAltText() {
                    return listItem.FileLeafRef + "&#10;" + window["ListView"]["Strings"]["L_Tag_Callout_BlockDeleteItem"];
                }
                function hasPolicyTip() {
                    return ListModule.Settings.SupportsPolicyTips && listItem._ip_UnifiedCompliancePolicyUIAction !== undefined && Number(listItem._ip_UnifiedCompliancePolicyUIAction) > 0 && !groupHeader;
                }
                function appendDocIcon(altText, title, useFileExtension, imageFileName, miscAttribute) {
                    ret.push('<img width="16" height="16" border="0" alt="');
                    ret.push(altText);
                    if (IsFileHandlerForAllNonOfficeFilesSupported()) {
                        if (usingFileExtensionControls) {
                            ret.push('" class="registerFileIcon');
                        }
                    }
                    else {
                        if (usingFileExtensionControls && (listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"] == "" || IE8Support.arrayIndexOf(renderCtx["allowedSuiteExtensionFileTypes"], listItem["File_x0020_Type"], 0) > -1)) {
                            ret.push('" class="registerFileIcon');
                        }
                    }
                    ret.push('" title="');
                    ret.push(title);
                    if (elementid !== undefined) {
                        ret.push('" id="');
                        ret.push(elementid);
                    }
                    if (useFileExtension && usingFileExtensionControls) {
                        if (imageFileName == "")
                            imageFileName = "icgen.gif";
                    }
                    ret.push('" src="' + ListView.ImageBasePath + "/_layouts/15/images/" + imageFileName);
                    ret.push('"');
                    if (miscAttribute !== undefined) {
                        ret.push(miscAttribute);
                    }
                    ret.push('/>');
                }
                function appendPolicyTipIcon() {
                    var policyTipIcon;
                    var policyTipHoverText;

                    if (Number(listItem._ip_UnifiedCompliancePolicyUIAction) == 1) {
                        policyTipIcon = 'dlpalert.png';
                        policyTipHoverText = window["ListView"]["Strings"]["L_DLP_Callout_PolicyTip"];
                    }
                    else {
                        policyTipIcon = 'dlpblock.png';
                        policyTipHoverText = window["ListView"]["Strings"]["L_DLP_Callout_BlockedItem"];
                    }
                    appendDocIcon(policyTipHoverText, policyTipHoverText, true, policyTipIcon, ' class="ms-listview-policyTipIcon"');
                    var postRenderCallbackCalled = false;

                    SPClientRenderer.AddPostRenderCallback(renderCtx, onPostRenderPolicyTipIcon);
                    function onPostRenderPolicyTipIcon() {
                        if (!postRenderCallbackCalled) {
                            postRenderCallbackCalled = true;
                            var docIcon = document.getElementById(elementid);

                            if (Boolean(docIcon)) {
                                DOM.AddEventHandler(docIcon, "onclick", function(evt) {
                                    if (Number(listItem._ip_UnifiedCompliancePolicyUIAction) == 1 || Number(listItem._ip_UnifiedCompliancePolicyUIAction) == 1 + 2) {
                                        EnsureScriptFunc("core.js", "LaunchDlpDialog", function() {
                                            LaunchDlpDialog(listItem, renderCtx, "DocIcon");
                                        });
                                    }
                                    else {
                                        WriteDocEngagementLog("Documents_PolicyTipIconClickNoNotify", "OneDrive_PolicyTipIconClickNoNotify");
                                    }
                                }, false);
                            }
                        }
                    }
                }
                return ret.join('');
            }
            function RenderListTitle(renderCtx, field, listItem, listSchema) {
                return RenderLinkToItem(renderCtx, listItem, listSchema, listItem.Title);
            }
            function RenderLinkToItem(renderCtx, listItem, listSchema, linkText) {
                var ret = [];

                if (listItem.FSObjType == '1') {
                    if (listSchema.IsDocLib == '1') {
                        RenderDocFolderLink(renderCtx, ret, LinkTitleValue(linkText), listItem, listSchema);
                    }
                    else {
                        RenderListFolderLink(ret, LinkTitleValue(linkText), listItem, listSchema);
                    }
                }
                else {
                    RenderTitle(ret, renderCtx, listItem, listSchema, LinkTitleValue(linkText));
                }
                NewGif(listItem, listSchema, ret);
                return ret.join('');
            }
            function RenderThumbnail(renderCtx, field, listItem, listSchema) {
                var ret = [];

                ret.push('<a href="' + EncodeUrl(listItem["FileRef"]) + '">');
                ret.push('<img galleryimg="false" border="0"');
                ret.push(' id="' + listItem.ID + 'webImgShrinked"');
                if (field.Name != "PreviewOnForm") {
                    ret.push(' class="ms-displayBlock"');
                }
                var maxSize = (field.Name == "PreviewOnForm" ? "256" : "128") + "px";

                ret.push(' style="max-width: ' + maxSize + '; max-height: ' + maxSize + '; margin:auto; visibility: hidden;"');
                ret.push(' onerror="displayGenericDocumentIcon(event.srcElement ? event.srcElement : event.target, ' + listItem.FSObjType + '); return false;"');
                ret.push(' onload="(event.srcElement ? event.srcElement : event.target).style.visibility = \'visible\';"');
                ret.push(' alt="');
                var comments = listItem["_Comments"];

                if (comments != null && comments != '') {
                    ret.push(Encoding.HtmlEncode(comments));
                }
                else {
                    ret.push(window["ListView"]["Strings"]["L_ImgAlt_Text"]);
                }
                ret.push('" src="' + EncodeUrl(getDocumentIconAbsoluteUrl(listItem, 256, renderCtx)) + '"/>');
                ret.push('</a>');
                return ret.join('');
            }
            return {
                URLwMenu: function(renderCtx, field, listItem, listSchema) {
                    var retValue;

                    if (listItem.FSObjType == '1') {
                        var ret = [];

                        ret.push("<a onfocus=\"OnLink(this)\" href=\"SubmitFormPost()\" onclick=\"ClearSearchTerm('");
                        ret.push(listSchema.View);
                        ret.push("');ClearSearchTerm('');SubmitFormPost('");
                        ret.push(listSchema.PagePath);
                        ret.push("?RootFolder=");
                        ret.push(URI_Encoding.encodeURIComponent(listItem.FileRef));
                        ret.push(listSchema.ShowWebPart);
                        ret.push("&FolderCTID=");
                        ret.push(listItem.ContentTypeId);
                        ret.push("');return false;\">");
                        ret.push(listItem.FileLeafRef);
                        ret.push("</a>");
                        retValue = ret.join('');
                    }
                    else {
                        retValue = RenderUrl(listItem, "URL", listSchema, field, true);
                    }
                    return retValue;
                },
                URLNoMenu: function(renderCtx, field, listItem, listSchema) {
                    return RenderUrl(listItem, "URL", listSchema, field, true);
                },
                mswh_Title: function(renderCtx, field, listItem, listSchema) {
                    var ret = [];

                    ret.push('<a onfocus="OnLink(this)" href="');
                    ret.push(listItem.FileRef);
                    ret.push('" onclick="LaunchWebDesigner(');
                    ret.push("'");
                    ret.push(listItem.FileRef);
                    ret.push("','design'); return false;");
                    ret.push('">');
                    ret.push(LinkTitleValue(listItem.Title));
                    ret.push('</a>');
                    return ret.join('');
                },
                LinkTitle: RenderListTitle,
                LinkTitleNoMenu: RenderListTitle,
                Edit: function(renderCtx, field, listItem, listSchema) {
                    if (ListModule.Util.hasEditPermission(listItem)) {
                        var id = ResolveId(listItem, listSchema);
                        var ret = [];

                        ret.push("<a href=\"");
                        ret.push(renderCtx.editFormUrl);
                        ret.push("&ID=");
                        ret.push(id);
                        ret.push("\" onclick=\"EditItemWithCheckoutAlert(event, '");
                        ret.push(renderCtx.editFormUrl);
                        ret.push("&ID=");
                        ret.push(id);
                        ret.push("', '");
                        ret.push(EditRequiresCheckout(listItem, listSchema));
                        ret.push("', '");
                        ret.push(listItem.IsCheckedoutToLocal);
                        ret.push("', '");
                        ret.push(escape(listItem.FileRef));
                        ret.push("', '");
                        ret.push(listSchema.HttpVDir);
                        ret.push("', '");
                        ret.push(listItem.CheckedOutUserId);
                        ret.push("', '");
                        ret.push(listSchema.Userid);
                        ret.push("');return false;\" target=\"_self\">");
                        ret.push("<img border=\"0\" alt=\"");
                        ret.push(window["ListView"]["Strings"]["L_SPClientEdit"]);
                        ret.push("\" src=\"" + ListView.ImageBasePath + "/_layouts/15/images/edititem.gif?rev=44" + "\"/></a>");
                        return ret.join('');
                    }
                    else {
                        return "&nbsp;";
                    }
                },
                DocIcon: RenderType,
                MasterPageIcon: RenderType,
                LinkFilename: function(renderCtx, field, listItem, listSchema) {
                    return LinkFilenameNoMenuInternal(renderCtx, listItem, listSchema);
                },
                LinkFilenameNoMenu: function(renderCtx, field, listItem, listSchema) {
                    return LinkFilenameNoMenuInternal(renderCtx, listItem, listSchema);
                },
                NumCommentsWithLink: function(renderCtx, field, listItem, listSchema) {
                    var ret = [];

                    ret.push(GenBlogLink("", window["ListView"]["Strings"]["L_SPClientNumComments"], "-396", window["ListView"]["Strings"]["L_SPClientNumComments"], window["ListView"]["Strings"]["L_SPClientNumComments"], listSchema, listItem));
                    ret.push("<span><a href=\"");
                    GenPostLink(ret, listSchema, listItem);
                    ret.push("\">&nbsp;");
                    ret.push(listItem.NumComments);
                    ret.push("&nbsp;");
                    ret.push("Comment(s)");
                    ret.push("</a></span>");
                    return ret.join('');
                },
                EmailPostLink: function(renderCtx, field, listItem, listSchema) {
                    return GenBlogLink("javascript:navigateMailToLink('", window["ListView"]["Strings"]["L_SPEmailPostLink"], "-267", window["ListView"]["Strings"]["L_SPEmailPostLink"], window["ListView"]["Strings"]["L_SPEmailPostLink"], listSchema, listItem);
                },
                Permalink: function(renderCtx, field, listItem, listSchema) {
                    return GenBlogLink("", "Permanent Link to Post", "-412", "Permanent Link to Post", "Permanent Link to Post", listSchema, listItem);
                },
                CategoryWithLink: function(renderCtx, field, listItem, listSchema) {
                    var ret = [];

                    ret.push("<a class=\"static menu-item\" href=\"");
                    ret.push(listSchema.HttpVDir);
                    ret.push("/");
                    ret.push("lists/Categories/Category.aspx?CategoryId=");
                    ret.push(listItem.ID);
                    ret.push("\" id=\"blgcat");
                    ret.push(listItem.ID);
                    ret.push("\"><span class=\"additional-backgroud\"><span class=\"menu-item-text\">");
                    ret.push(listItem.Title);
                    ret.push("</span></span></a>");
                    return ret.join('');
                },
                LinkIssueIDNoMenu: function(renderCtx, field, listItem, listSchema) {
                    var ret = [];

                    ret.push("<a href=\"");
                    ret.push(renderCtx.displayFormUrl);
                    ret.push("&ID=");
                    ret.push(listItem.ID);
                    ret.push("\" onclick=\"");
                    AddUIInstrumentationClickEvent(ret, listItem, 'Navigation');
                    ret.push("EditLink2(this,");
                    ret.push(renderCtx.ctxId);
                    ret.push(");return false;\" target=\"_self\">");
                    ret.push(listItem.ID);
                    ret.push("</a>");
                    return ret.join('');
                },
                SelectTitle: function(renderCtx, field, listItem, listSchema) {
                    if (listSchema.SelectedID == listItem.ID || listSchema.SelectedID == '-1' && listItem.firstRow == true)
                        return '<img border="0" align="absmiddle" style="cursor: hand" src="' + ListView.ImageBasePath + '/_layouts/15/images/rbsel.gif' + '" alt="' + window["ListView"]["Strings"]["L_SPSelected"] + '" />';
                    else {
                        var ret = [];

                        ret.push("<a href=\"javascript:SelectField('");
                        ret.push(listSchema.View);
                        ret.push("','");
                        ret.push(listItem.ID);
                        ret.push("');return false;\" onclick=\"SelectField('");
                        ret.push(listSchema.View);
                        ret.push("','");
                        ret.push(listItem.ID);
                        ret.push("');return false;\" target=\"_self\">");
                        ret.push('<img border="0" align="absmiddle" style="cursor: hand" src="' + ListView.ImageBasePath + '/_layouts/15/images/rbunsel.gif' + '"  alt="');
                        ret.push(window["ListView"]["Strings"]["L_SPGroupBoardTimeCardSettingsNotFlex"]);
                        ret.push('" /></a>');
                        return ret.join('');
                    }
                },
                DisplayResponse: function(renderCtx, field, listItem, listSchema) {
                    var ret = [];

                    ret.push('<a onfocus="OnLink(this)" href="');
                    ret.push(renderCtx.displayFormUrl);
                    ret.push('&ID=');
                    ret.push(listItem.ID);
                    ret.push('" onclick="GoToLinkOrDialogNewWindow(this);return false;" target="_self" id="onetidViewResponse">');
                    ret.push(window["ListView"]["Strings"]["L_SPView_Response"]);
                    ret.push(' #');
                    ret.push(listItem.ID);
                    ret.push('</a>');
                    return ret.join('');
                },
                Completed: function(renderCtx, field, listItem, listSchema) {
                    if (listItem["_Level"] == '1')
                        return window["ListView"]["Strings"]["L_SPYes"];
                    else
                        return window["ListView"]["Strings"]["L_SPNo"];
                },
                RepairDocument: function(renderCtx, field, listItem, listSchema) {
                    return '<input id="chkRepair" type="checkbox" title="' + window["ListView"]["Strings"]["L_SPRelink"] + '" docID="' + listItem.ID + '" />';
                },
                Combine: function(renderCtx, field, listItem, listSchema) {
                    if (listItem.FSObjType == '0') {
                        var ret = '<input id="chkCombine" type="checkbox" title="';

                        ret += window["ListView"]["Strings"]["L_SPMerge"];
                        ret += '" href="';
                        var url;

                        if (listItem.FSObjType == '0')
                            url = String(listSchema.HttpVDir) + String(listItem.FileRef);
                        else
                            url = listItem.FileRef;
                        ret += url + '" />';
                        ret += '<input id="chkUrl" type="hidden" href="';
                        ret += listItem.TemplateUrl;
                        ret += '" />';
                        ret += '<input id="chkProgID" type="hidden" href="';
                        ret += listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapcon"];
                        ret += '" />';
                        return ret;
                    }
                    return '';
                },
                HealthReportSeverityIcon: function(renderCtx, field, listItem, listSchema) {
                    var healthSeverity = new String(listItem.HealthReportSeverity);
                    var index = healthSeverity.indexOf(" - ");

                    healthSeverity = healthSeverity.substring(0, index);
                    var pngUrl;

                    if (healthSeverity == '1')
                        pngUrl = 'hltherr';
                    else if (healthSeverity == '2')
                        pngUrl = 'hlthwrn';
                    else if (healthSeverity == '3')
                        pngUrl = 'hlthinfo';
                    else if (healthSeverity == '4')
                        pngUrl = 'hlthsucc';
                    else
                        pngUrl = 'hlthfail';
                    return '<img src="' + ListView.ImageBasePath + '/_layouts/15/images/' + pngUrl + '.png" alt="' + healthSeverity + '" />';
                },
                FileSizeDisplay: function(renderCtx, field, listItem, listSchema) {
                    var ret = [];

                    if (listItem.FSObjType == '0')
                        return String(Math.ceil(listItem.File_x0020_Size / 1024)) + ' KB';
                    else
                        return '';
                },
                NameOrTitle: function(renderCtx, field, listItem, listSchema) {
                    return RenderLinkToItem(renderCtx, listItem, listSchema, listItem["FileLeafRef"]);
                },
                ImageSize: function(renderCtx, field, listItem, listSchema) {
                    var ret = [];

                    if (listItem.FSObjType == '0') {
                        if (listItem["ImageWidth"] != '' && listItem["ImageWidth"] != '0') {
                            ret.push('<span dir="ltr">');
                            ret.push(listItem["ImageWidth"] + ' x ' + listItem["ImageHeight"]);
                            ret.push('</span>');
                        }
                    }
                    return ret.join('');
                },
                ThumbnailOnForm: RenderThumbnail,
                PreviewOnForm: RenderThumbnail,
                Thumbnail: RenderThumbnail,
                FileType: function(renderCtx, field, listItem, listSchema) {
                    return listItem["File_x0020_Type"];
                },
                _IsRecord: function(renderCtx, field, listItem, listSchema) {
                    var blockDeleteByComplianceFlags = typeof listItem["_ComplianceFlags"] !== 'undefined' && listItem["_ComplianceFlags"] != null && (listItem["_ComplianceFlags"] & 1) == 1;

                    if (blockDeleteByComplianceFlags)
                        return window["ListView"]["Strings"]["L_SPYes"];
                    else
                        return window["ListView"]["Strings"]["L_SPNo"];
                }
            };
        })();
    }
    ComputedFieldRenderer_InitializePrototype();
    RenderCalloutAffordance = function(fSelectItem, listItem, strCalloutLaunchPointID, fIsForTileView) {
        var ret = [];
        var isForTileView = Boolean(fIsForTileView);
        var anchorClassName = "ms-lstItmLinkAnchor " + (isForTileView ? "ms-ellipsis-a-tile" : "ms-ellipsis-a");

        ret.push("<a ms-jsgrid-click-passthrough=\"true\" class=\"" + anchorClassName + "\" title=\"");
        ret.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_OpenMenuAriaLabel"]));
        ret.push("\" aria-haspopup=\"true\" aria-expanded=\"false\"");
        ret.push("onclick=\"");
        if (!fIsForTileView) {
            AddUIInstrumentationClickEvent(ret, listItem, 'Hover');
        }
        if (fSelectItem) {
            ret.push("OpenCalloutAndSelectItem(this, event, this, '" + listItem.ID + "'); return false;\" href=\"#\" id=\"" + strCalloutLaunchPointID + "\" >");
        }
        else {
            ret.push("OpenCallout(this, event, this, '" + listItem.ID + "'); return false;\" href=\"#\" id=\"" + strCalloutLaunchPointID + "\" >");
        }
        var imageClassName = isForTileView ? "ms-ellipsis-icon-tile" : "ms-ellipsis-icon";

        ret.push("<img class=\"" + imageClassName + "\" src=\"" + GetThemedImageUrl("spcommon.png") + "\" alt=\"" + Encoding.HtmlEncode(window["ListView"]["Strings"]["L_OpenMenu"]) + "\" /></a>");
        return ret.join('');
    };
    RenderECB = function(renderCtx, listItem, field, content, fMakeNewColumn) {
        var ret = [];
        var listSchema = renderCtx.ListSchema;

        ret.push("<div class=\"ms-vb " + (fMakeNewColumn == true ? "" : "ms-tableCell ms-list-TitleLink") + " ms-vb-menuPadding itx\" CTXName=\"ctx");
        ret.push(renderCtx.ctxId);
        ret.push("\" id=\"");
        ret.push(listItem.ID);
        ret.push("\" Field=\"");
        ret.push(field.Name);
        ret.push("\" Perm=\"");
        ret.push(listItem.PermMask);
        ret.push("\" EventType=\"");
        ret.push(listItem.EventType);
        ret.push("\">");
        ret.push(content);
        ret.push("</div>");
        if (fMakeNewColumn == true) {
            ret.push("</td><td class=\"ms-list-itemLink-td ms-cellstyle");
            if (listSchema.Field[listSchema.Field.length - 1] == field)
                ret.push(" ms-vb-lastCell");
            ret.push("\">");
        }
        if (!PageMinimized()) {
            ret.push("<div class=\"ms-list-itemLink " + (fMakeNewColumn == true ? "" : "ms-tableCell ms-alignRight") + "\" ");
            ret.push("onclick=\"CoreInvoke('ShowECBMenuForTr', this, event");
            ret.push(", ListView.Strings");
            ret.push("); return false;\">");
            ret.push("<a ms-jsgrid-click-passthrough=\"true\" class=\"ms-lstItmLinkAnchor ms-ellipsis-a\" title=\"");
            ret.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_OpenMenuECB"]));
            ret.push("\" aria-haspopup=\"true\" ");
            ret.push("onclick=\"CoreInvoke('ShowECBMenuForTr', this.parentNode, event");
            ret.push(", ListView.Strings");
            ret.push("); return false; \" href=\"#\" >");
            ret.push("<img class=\"ms-ellipsis-icon\" src=\"" + GetThemedImageUrl("spcommon.png") + "\" alt=\"" + Encoding.HtmlEncode(window["ListView"]["Strings"]["L_OpenMenu"]) + "\" /></a>");
            ret.push("</div>");
        }
        return ret.join('');
    };
    RenderCalloutMenu = function(renderCtx, listItem, field, content, fMakeNewColumn) {
        var ret = [];
        var calloutLaunchPointID = "ctx" + renderCtx.ctxId + "_" + listItem.ID + "_calloutLaunchPoint";
        var listSchema = renderCtx.ListSchema;

        ret.push("<div class=\"ms-vb " + (fMakeNewColumn == true ? "" : "ms-tableCell ms-list-TitleLink") + " itx\" CTXName=\"ctx");
        ret.push(renderCtx.ctxId);
        ret.push("\" id=\"");
        ret.push(listItem.ID);
        ret.push("\" App=\"");
        ret.push(listItem["File_x0020_Type.mapapp"]);
        ret.push("\">");
        ret.push(content);
        ret.push("</div>");
        if (fMakeNewColumn == true) {
            ret.push("</td><td class=\"ms-list-itemLink-td ms-cellstyle");
            if (listSchema.Field[listSchema.Field.length - 1] == field)
                ret.push(" ms-vb-lastCell");
            ret.push("\" role=\"gridcell\">");
        }
        if (!PageMinimized()) {
            if (typeof listItem.RenderCalloutWithoutHover != 'undefined' && listItem.RenderCalloutWithoutHover) {
                ret.push(RenderCalloutAffordance(false, listItem, calloutLaunchPointID, true));
            }
            else {
                ret.push("<div class=\"ms-list-itemLink " + (fMakeNewColumn == true ? "" : "ms-tableCell ms-alignRight") + " \" ");
                ret.push(" onclick=\"ShowMenuForTrOuter(this,event, true); return false;\" >");
                ret.push(RenderCalloutAffordance(true, listItem, calloutLaunchPointID, false));
                ret.push("</div>");
            }
        }
        return ret.join('');
    };
    ;
    getDocumentIconAbsoluteUrl = function(listItem, size, renderCtx) {
        var isFolder = listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"] == '';
        var sizeStr;

        if (typeof size === "undefined" || size === 16)
            sizeStr = "";
        else if (isFolder)
            sizeStr = String(size);
        else if (size === 32)
            sizeStr = "lg_";
        else
            sizeStr = String(size) + "_";
        EnsureFileLeafRefName(listItem);
        EnsureFileLeafRefSuffix(listItem);
        EnsureFileDirRef(listItem);
        var alternateThumbnailUrl = listItem["AlternateThumbnailUrl"];
        var hasAlternateThumbnailUrl = ListModule.Util.isDefinedAndNotNullOrEmpty(alternateThumbnailUrl);
        var fileExtension = listItem["FileLeafRef.Suffix"];
        var previewExists = listItem["PreviewExists.value"] == "1" && ListModule.Util.isDefinedAndNotNullOrEmpty(listItem["FileLeafRef.Name"]) && ListModule.Util.isDefinedAndNotNullOrEmpty(fileExtension) || listItem["PreviewExists.value"] == "" && renderCtx != null && renderCtx.ListTemplateType == 109;
        var isAudioFile = ListModule.Util.isDefinedAndNotNullOrEmpty(fileExtension) && (fileExtension == "mp3" || fileExtension == "wma" || fileExtension == "wav" || fileExtension == "oga");
        var currCtx = typeof ctx != "undefined" ? ctx : renderCtx;

        if (sizeStr != '' && (hasAlternateThumbnailUrl || previewExists)) {
            if (hasAlternateThumbnailUrl) {
                return String(alternateThumbnailUrl);
            }
            else {
                return listItem["FileDirRef"] + "/_w/" + listItem["FileLeafRef.Name"] + "_" + listItem["FileLeafRef.Suffix"] + ".jpg";
            }
        }
        else if (isAudioFile)
            return currCtx.imagesPath + "audiopreview.png";
        else if (isFolder)
            return currCtx.imagesPath + "folder" + sizeStr + ".gif";
        else
            return currCtx.imagesPath + sizeStr + listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"];
    };
    displayGenericDocumentIcon = function(imgElement, fsObjType, renderCtx) {
        var imageFileName = fsObjType === 1 ? "256_folder.png" : "256_icgen.png";
        var currCtx = typeof ctx != "undefined" ? ctx : renderCtx;
        var newSrc = currCtx.imagesPath + imageFileName;

        if (imgElement.src !== newSrc)
            imgElement.src = newSrc;
    };
    FieldRenderer_InitializePrototype();
    RawFieldRenderer_InitializePrototype();
    AttachmentFieldRenderer_InitializePrototype();
    RecurrenceFieldRenderer_InitializePrototype();
    ProjectLinkFieldRenderer_InitializePrototype();
    AllDayEventFieldRenderer_InitializePrototype();
    NumberFieldRenderer_InitializePrototype();
    BusinessDataFieldRenderer_InitializePrototype();
    DateTimeFieldRenderer_InitializePrototype();
    TextFieldRenderer_InitializePrototype();
    LookupFieldRenderer_InitializePrototype();
    NoteFieldRenderer_InitializePrototype();
    UrlFieldRenderer_InitializePrototype();
    UserFieldRenderer_InitializePrototype();
    s_ImnId = 1;
    ;
    SPMgr.prototype = {
        NewGroup: undefined,
        RenderField: undefined,
        RenderFieldByName: undefined
    };
    spMgr = new SPMgr();
    if (typeof RegisterSharedWithFieldRenderer == "function") {
        RegisterSharedWithFieldRenderer();
    }
    InitializeSingleItemPictureView();
    if (typeof Sys != 'undefined' && Sys != null && Sys.Application != null)
        Sys.Application.notifyScriptLoaded();
    if (typeof NotifyScriptLoadedAndExecuteWaitingJobs == 'function')
        NotifyScriptLoadedAndExecuteWaitingJobs("clienttemplates.js");
    if (typeof spWriteProfilerMark == 'function')
        spWriteProfilerMark("perfMarkEnd_" + "clienttemplates.js");
}
function ContextMenu(def, noClose, closeAllMenusOnClick, parentMenuItemId) {
    ;
    ;
    ;
    ;
    var m_rootElem = null;
    var m_overlay = null;
    var m_prevSelIndex = -1;
    var isRtL = DOM.rightToLeft;
    var numOverlay = 0;
    var onClickClose = !Boolean(noClose);
    var renderer = new Renderer();

    if (typeof def.useSmartPositioning == "undefined") {
        def.useSmartPositioning = true;
    }
    renderer.SetTemplate("overlay", "{%version 2.0}\u003cdiv class=\"ms-contextmenu-overlay ms-js-overlay-contextmenu\" onmousedown=\"{+overlayClick}\"\u003e\u003c/div\u003e");
    renderer.SetTemplate("root", "{%version 2.0}\u003cdiv class=\"ms-contextmenu-box ms-js-contextmenu\" style=\"position:fixed; left: {=left}px; top: {=top}px;\" onclick=\"{+stopPropagation}\" role=\"menu\"\u003e\u003cul class=\"ms-contextmenu-list\" id=\"{=id}\"\u003e\n                {%foreach item items}\n            \u003c/ul\u003e\u003c/div\u003e");
    renderer.SetTemplate("item", "{%version 2.0}{%templateSelect itemTemplate}");
    renderer.SetTemplate("separatorItem", "{%version 2.0}\u003cli class=\"ms-contextmenu-separator\"\u003e\u003chr class=\"ms-contextmenu-separatorHr\" /\u003e\u003c/li\u003e");
    renderer.SetTemplate("linkItem", "{%version 2.0}\u003cli class=\"ms-contextmenu-item\" id=\"{=liId}\" onkeydown=\"{+keypress .}\" oncontextmenu=\"{+rightClickHandler .}\" role=\"menu-item\" aria-label=\"{=tooltip}\" tabIndex=\"-1\"\u003e\u003ca class=\"ms-contextmenu-link\" id=\"{=id}\" href=\"{=href}\" title=\"{=text}\" onclick=\"{+itemClick .}\" target=\"{=target}\" style=\"{=mstyle}\"\u003e\n                {=text}\u003cspan class=\"ms-contextmenu-right-glyph glyph-class\"\u003e{=glyph}\u003c/span\u003e\u003c/a\u003e\u003c/li\u003e");
    renderer.SetTemplate("selectItem", "{%version 2.0}\u003cli class=\"ms-contextmenu-item\" id=\"{=liId}\" onkeydown=\"{+keypress .}\" oncontextmenu=\"{+rightClickHandler .}\" role=\"menu-item\" aria-label=\"{=tooltip}\" tabIndex=\"-1\"\u003e\u003cform class=\"ms-contextmenu-link ms-contextmenu-selectable\" onclick=\"{+itemSelect .}\"\u003e\u003cinput type=\"checkbox\" id=\"{=id}\" class=\"ms-contextmenu-select\" title=\"{=text}\"\u003e{=text}\u003c/input\u003e\u003c/form\u003e\u003c/li\u003e");
    renderer.SetTemplate("glyphItem", "{%version 2.0}\u003cli class=\"ms-contextmenu-item\" id=\"{=liId}\" onkeydown=\"{+keypress .}\" oncontextmenu=\"{+rightClickHandler .}\" role=\"menu-item\" aria-label=\"{=tooltip}\" tabIndex=\"-1\"\u003e\u003ca class=\"ms-contextmenu-link\" id=\"{=id}\" onclick=\"{+itemClick .}\"\u003e\u003cspan class=\"ms-contextmenu-select ms-contextmenu-glyph\"\u003e{=glyph}\u003c/span\u003e{=text}\n            \u003c/a\u003e\u003c/li\u003e");
    renderer.SetTemplate("imgItem", "{%version 2.0}\u003cli class=\"ms-contextmenu-item\" id=\"{=liId}\" onkeydown=\"{+keypress .}\" oncontextmenu=\"{+rightClickHandler .}\" role=\"menu-item\" aria-label=\"{=tooltip}\" tabIndex=\"-1\"\u003e\u003ca class=\"ms-contextmenu-link\" id=\"{=id}\" href=\"{=href}\" title=\"{=text}\" onclick=\"{+itemClick .}\" target=\"{=target}\"\u003e\u003cimg class=\"ms-contextmenu-select\" src=\"{=imgsrc}\" role=\"presentation\" alt=\"\" width=\"16\" height=\"16\" /\u003e{=text}\n            \u003c/a\u003e\u003c/li\u003e");
    renderer.SetTemplate("subMenu", "{%version 2.0}\u003cli class=\"ms-contextmenu-item\" role=\"menu-item\" id=\"{=liId}\" onkeydown=\"{+keypress .}\" oncontextmenu=\"{+rightClickHandler .}\" aria-label=\"{=tooltip}\" tabIndex=\"-1\"\u003e\u003ca class=\"ms-contextmenu-link\" id=\"{=id}\" href=\"#\" title=\"{=text}\" onclick=\"{+createSubMenu .}\" onmouseenter=\"{+createSubMenu .}\" onmouseleave=\"{+menuMouseLeave .}\"\u003e\n        {=text}\u003cspan class=\"ms-contextmenu-right-glyph\"\u003e{=glyph}\u003c/span\u003e\u003c/a\u003e\u003c/li\u003e");
    var _idBase = "menuItemId_";

    if (typeof ContextMenu._idUniqueNum == "undefined") {
        ContextMenu._idUniqueNum = 0;
    }
    this.open = function(openSubMenu) {
        if (!Boolean(openSubMenu)) {
            closeMenu();
        }
        createOverlay();
        createMenu();
    };
    this.close = function() {
        closeMenu();
    };
    this.update = function() {
        UpdateSelectedItems();
    };
    this.root = function() {
        return m_rootElem;
    };
    renderer.RegisterHandler("overlayClick", function(evt) {
        DOM.cancelDefault(evt);
        closeMenu(true);
        return false;
    });
    renderer.RegisterHandler("stopPropagation", IE8Support.stopPropagation);
    renderer.RegisterHandler("itemClick", function(evt, menuItem) {
        var listener = createEventListener.call(this, menuItem.onclick);

        return listener.call(this, evt, onClickClose, menuItem);
    });
    renderer.RegisterHandler("itemSelect", function(evt, menuItem) {
        var listener = createEventListener.call(this, menuItem.onclick);

        return listener.call(this, evt, onClickClose, menuItem);
    });
    renderer.RegisterHandler("keypress", function(evt) {
        return keyDownHandler(evt);
    });
    renderer.RegisterHandler("rightClickHandler", function(evt) {
        if (Boolean(evt.stopPropagation))
            evt.stopPropagation();
        else
            evt.cancelBubble = true;
        if (Boolean(evt.preventDefault))
            evt.preventDefault();
    });
    renderer.RegisterHandler("createSubMenu", function(evt, menuItem) {
        return ensureSubMenu(menuItem);
    });
    renderer.RegisterHandler("menuMouseLeave", function(evt) {
        var listener = createEventListener.call(this, handleMenuMouseLeave);

        return listener.call(this, evt);
    });
    for (var i = 0; i < def.items.length; i++) {
        var item = def.items[i];

        item.itemTemplate = item.separator === true ? "separatorItem" : item.submenu === true ? "subMenu" : item.selectable === true ? "selectItem" : item.imgsrc != null ? "imgItem" : item.glyph != null ? "glyphItem" : "linkItem";
        if (item.href == null) {
            item.href = "javascript:";
        }
        if (!item.separator && !Boolean(item.id)) {
            item.id = _idBase + ContextMenu._idUniqueNum.toString();
        }
        item.liId = _idBase + "_li_" + ContextMenu._idUniqueNum.toString();
        ContextMenu._idUniqueNum++;
        if (item.parentId == null && Boolean(parentMenuItemId)) {
            item.parentId = parentMenuItemId;
        }
    }
    function closeMenu(closeAllMenus) {
        var elemParent = null;

        if (Boolean(m_overlay)) {
            document.body.removeChild(m_overlay);
            m_overlay = null;
        }
        if (Boolean(m_rootElem)) {
            elemParent = m_rootElem.parentNode;
            if (Boolean(elemParent)) {
                elemParent.removeChild(m_rootElem);
                m_rootElem = null;
            }
            if (elemParent != null) {
                var selItem = m_prevSelIndex < 0 ? 0 : m_prevSelIndex;
                var mitem = def.items[selItem];
                var backToItem = null;

                if (Boolean(mitem)) {
                    if (Boolean(mitem.parentId)) {
                        backToItem = document.getElementById(mitem.parentId);
                    }
                    else {
                        backToItem = document.getElementById(mitem.liId);
                    }
                    if (Boolean(backToItem)) {
                        backToItem.focus();
                    }
                }
            }
        }
        if (closeAllMenus) {
            var elemsToClose = document.querySelectorAll(".ms-js-contextmenu");

            ;
            var overlaysToClose = document.querySelectorAll(".ms-contextmenu-overlay");

            ;
            for (i = Number(elemsToClose.length) - 1; i >= 0; i--) {
                var elemToClose = elemsToClose[i];
                var overlayToClose = overlaysToClose[i];

                if (elemToClose != null) {
                    elemParent = elemToClose.parentNode;
                    if (elemParent != null) {
                        elemParent.removeChild(elemToClose);
                    }
                    elemToClose = null;
                    if (overlayToClose != null) {
                        document.body.removeChild(overlayToClose);
                        overlayToClose = null;
                    }
                }
            }
        }
    }
    function render(templateName, obj) {
        var tempDiv = document.createElement("div");

        tempDiv.innerHTML = renderer.Render(templateName, obj);
        return tempDiv.removeChild(tempDiv.firstChild);
    }
    function createOverlay() {
        if (Boolean(m_overlay)) {
            return;
        }
        m_overlay = render("overlay");
        if (Boolean(m_overlay)) {
            m_overlay.setAttribute("id", "cm_overlay" + String(numOverlay++));
        }
        document.body.appendChild(m_overlay);
    }
    function createMenu() {
        ;
        if (!Boolean(def.evt))
            return;
        var evt = def.evt;
        var elem = Boolean(evt.target) ? evt.target : evt.srcElement;
        var xpos = evt.clientX;
        var ypos = evt.clientY;

        if (xpos === 0 && ypos === 0 && Boolean(elem)) {
            xpos = DOM.AbsLeft(elem) + elem.clientWidth / 2;
            ypos = DOM.AbsTop(elem) + elem.clientHeight / 2;
        }
        var data = {
            'top': ypos,
            'left': xpos,
            'items': def.items
        };

        m_rootElem = render(Boolean(def.rootId) ? def.rootId : "root", data);
        document.body.appendChild(m_rootElem);
        var nMenus = document.querySelectorAll("div.ms-contextmenu-box");
        var nWidth = [];

        for (var j = 0; j < nMenus.length; j++) {
            nWidth.push(nMenus[j].clientWidth);
        }
        DOM.EnsureElementIsInViewPort(m_rootElem, 5, nWidth);
        if (isRtL) {
            fixupRtLXPosition(m_rootElem, 5, nWidth);
        }
        UpdateSelectedItems();
        var liItemFirst = m_rootElem.querySelector("li.ms-contextmenu-item");

        if (liItemFirst != null) {
            if (typeof liItemFirst.active == 'function')
                liItemFirst.active();
            else
                liItemFirst.focus();
        }
    }
    function pointInDomElem(x, y, elm) {
        var elmLeft = DOM.AbsLeft(elm);
        var elmTop = DOM.AbsTop(elm);

        return x >= elmLeft && x <= elmLeft + elm.clientWidth && y >= elmTop && y <= elmTop + elm.clientHeight;
    }
    function handleMenuMouseLeave(evt) {
        var mouseInsideAnyMenu = false;
        var subMenuToClose = [];
        var nMenus = document.querySelectorAll("div.ms-contextmenu-box");
        var evtCoord = DOM.GetEventCoords(evt);

        for (var j = nMenus.length - 1; j >= 0; j--) {
            if (pointInDomElem(evtCoord.x, evtCoord.y, nMenus[j])) {
                mouseInsideAnyMenu = true;
                break;
            }
            else {
                subMenuToClose.push(nMenus[j]);
            }
        }
        if (mouseInsideAnyMenu) {
            for (j = 0; j < subMenuToClose.length; j++) {
                document.body.removeChild(subMenuToClose[j]);
            }
        }
    }
    function fixupRtLXPosition(ele, padding, widths) {
        var elementLeft = Number(DOM.AbsLeft(ele));
        var elementWidth = Number(ele.clientWidth);
        var viewPortWidth = Number(document.documentElement.clientWidth);
        var newLeft = elementLeft;

        if (Boolean(widths) && widths.length > 1) {
            newLeft -= widths[widths.length - 1] + widths[widths.length - 2];
        }
        if (newLeft !== elementLeft) {
            newLeft += padding;
            newLeft = Math.max(newLeft, 0);
            ele.style.position = "absolute";
            ele.style.top = ele.style.top;
            ele.style.left = String(newLeft) + "px";
        }
    }
    function keyDownHandler(evt) {
        var nKeyCode = evt['keyCode'];
        var shiftKey = evt['shiftKey'];

        if (isRtL) {
            if (nKeyCode == 37)
                nKeyCode = 39;
            else if (nKeyCode == 39)
                nKeyCode = 37;
        }
        var mitem = null;

        switch (nKeyCode) {
        case 38:
            moveMenuSelection(-1);
            break;
        case 40:
            moveMenuSelection(1);
            break;
        case 9:
            if (Boolean(shiftKey))
                moveMenuSelection(-1);
            else
                moveMenuSelection(1);
            break;
        case 37:
        case 27:
            closeMenu();
            break;
        case 39:
            {
                mitem = def.items[m_prevSelIndex];
                if (Boolean(mitem) && Boolean(mitem.items)) {
                    ensureSubMenu(mitem);
                }
                break;
            }
        case 13:
            {
                mitem = def.items[m_prevSelIndex];
                if (mitem != null && mitem.selectable) {
                    mitem.selected = !mitem.selected;
                    UpdateSelectedItems();
                }
                else if (Boolean(mitem.items)) {
                    ensureSubMenu(mitem);
                }
                else {
                    if (onClickClose) {
                        closeMenu(true);
                    }
                    mitem.onclick(this, evt, mitem.id);
                }
                break;
            }
        }
        return false;
    }
    function AddOrRemoveItemSelection(idxItem, fremove) {
        var mitem = def.items[idxItem];

        if (!Boolean(mitem))
            return;
        var elem = document.getElementById(mitem.liId);

        if (elem != null && elem.tagName.toLowerCase() == 'li') {
            if (fremove)
                CSSUtil.RemoveClass(elem, "ms-contextmenu-itemSelected");
            else {
                CSSUtil.AddClass(elem, "ms-contextmenu-itemSelected");
                if (typeof elem.setActive != 'undefined')
                    elem.setActive();
                else
                    elem.focus();
            }
        }
        return;
    }
    function nextIndex(direction, nindex) {
        var nNumItems = def.items.length;
        var index = (nindex + direction) % nNumItems;

        if (index < 0)
            index = nNumItems - 1;
        return index;
    }
    function moveMenuSelection(direction) {
        var nNumItems = def.items.length;
        var nIndex = -1;
        var curItem = null;

        if (m_prevSelIndex < 0) {
            nIndex = direction > 0 ? 0 : nNumItems - 1;
        }
        else {
            AddOrRemoveItemSelection(m_prevSelIndex, true);
            nIndex = nextIndex(direction, m_prevSelIndex);
        }
        curItem = def.items[nIndex];
        while (curItem != null && curItem.separator) {
            nIndex = nextIndex(direction, nIndex);
            curItem = def.items[nIndex];
        }
        m_prevSelIndex = nIndex;
        AddOrRemoveItemSelection(nIndex, false);
    }
    function isSubMenuExist(menuItem) {
        if (menuItem.items.length > 0 && Boolean(menuItem.items[0])) {
            var subitem = document.getElementById(String(menuItem.items[0].liId));

            return Boolean(subitem);
        }
        return false;
    }
    function ensureSubMenu(menuItem) {
        if (isSubMenuExist(menuItem))
            return;
        var eleParent = document.getElementById(menuItem.liId);
        var xPos = DOM.AbsLeft(eleParent) + eleParent.clientWidth + 2;
        var subMenuDef = {
            evt: {
                clientX: xPos,
                clientY: DOM.AbsTop(eleParent)
            },
            items: menuItem.items,
            useSmartPositioning: def.useSmartPositioning !== false
        };
        var newSubMenu = new ContextMenu(subMenuDef, false, true, menuItem.liId);

        newSubMenu.open(true);
    }
    function shouldCloseOnItem(mitem) {
        if (!Boolean(mitem)) {
            if (m_prevSelIndex >= 0) {
                mitem = def.items[m_prevSelIndex];
            }
        }
        var sClose = true;

        for (var k = 0; k < def.items.length; k++) {
            if (def.items[k].id === mitem.id) {
                sClose = !Boolean(def.items[k].submenu);
                break;
            }
        }
        return sClose;
    }
    function createEventListener(listener) {
        return function(evt, bonclickCloseMenu, mitem) {
            if (bonclickCloseMenu && shouldCloseOnItem(mitem)) {
                closeMenu(true);
            }
            if (listener == null) {
                return;
            }
            return listener.call(this, evt, Boolean(mitem) ? mitem.id : null);
        };
    }
    function UpdateSelectedItems() {
        for (var n = 0; n < def.items.length; n++) {
            if (Boolean(def.items[n].selectable)) {
                var curitem = def.items[n];
                var elmCheckbox = document.getElementById(curitem.id);

                if (typeof elmCheckbox != 'undefined' && elmCheckbox.title == curitem.text) {
                    elmCheckbox.checked = Boolean(def.items[n].selected);
                }
            }
        }
    }
}
var isSLV;

function InitListViewSettings() {
    ListModule.Settings.SupportsCallouts = SPListView;
    ListModule.Settings.SupportsDragDrop = SPListView;
    ListModule.Settings.SupportsRibbon = SPListView;
    ListModule.Settings.SupportsQCB = SPListView;
    ListModule.Settings.SupportsUpload = SPListView;
    ListModule.Settings.SupportsInplHash = SPListView;
    ListModule.Settings.SupportsAnimation = SPListView;
    ListModule.Settings.SupportsGrouping = SPListView;
    ListModule.Settings.SupportsNonCSR = SPListView;
    ListModule.Settings.SupportsInPlaceEdit = SPListView;
    ListModule.Settings.SupportsItemDelete = SPListView;
    ListModule.Settings.SupportsCheckout = SPListView;
    ListModule.Settings.SupportsPopup = SPListView;
    ListModule.Settings.SupportsErrorDlg = SPListView;
    ListModule.Settings.SupportsFileAttach = SPListView;
    ListModule.Settings.SupportsCopies = SPListView;
    ListModule.Settings.SupportsModeration = SPListView;
    ListModule.Settings.SupportsMQuery = SPListView;
    ListModule.Settings.SupportsForms = SPListView;
    ListModule.Settings.SupportsViewSelectorPivot = SPListView;
    ListModule.Settings.SupportsWebPageLibraryTemplate = SPListView;
    ListModule.Settings.SupportsDeveloperAppTemplate = SPListView;
    ListModule.Settings.SupportsDelayLoading = SPListView;
    ListModule.Settings.SupportsItemSelection = SPListView;
    ListModule.Settings.SupportsSharingDialog = SPListView;
    ListModule.Settings.UseAbsoluteUserDispUrl = !SPListView;
    ListModule.Settings.SupportsCrossDomainPhotos = SPListView;
    ListModule.Settings.SupportsTouch = SPListView;
    ListModule.Settings.SupportsBusinessDataField = SPListView;
    ListModule.Settings.SupportsUrlTokenReplacement = SPListView;
    ListModule.Settings.SupportsAsyncDataLoad = SPListView;
    ListModule.Settings.SupportsBreadCrumb = SPListView;
    ListModule.Settings.SupportsSubmitFormPost = SPListView;
    ListModule.Settings.SupportsFacePile = SPListView;
    ListModule.Settings.SupportsRest = isSLV;
    ListModule.Settings.SupportsDatapipes = isSLV;
    ListModule.Settings.SupportsOldDesktopMenus = SPListView;
    ListModule.Settings.SupportsTaskListEditMode = SPListView;
}
var bListViewSettingsInitialized;

function InitListViewFlightSettings() {
    if (Boolean(bListViewSettingsInitialized)) {
        return;
    }
    ListModule.Settings.SupportsFileExtensionControls = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(439);
    ListModule.Settings.SupportsFileHandlerForAllNonOfficeFiles = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(754);
    ListModule.Settings.SupportsFileExtensionDataPipe = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(461);
    ListModule.Settings.SupportsFileHandlerAddInPicker = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(512);
    ListModule.Settings.SupportsFileHandlerFileCreation = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(540);
    ListModule.Settings.SupportsAddToOneDrive = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(134);
    ListModule.Settings.SupportsAddToOneDriveQCB = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(161);
    ListModule.Settings.SupportsPeopleHoverCard = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(0);
    ListModule.Settings.SupportsMaintainUserChrome = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(63);
    ListModule.Settings.SupportsInfiniteScroll = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(149);
    ListModule.Settings.SupportsAddToOneDriveInSync = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(259);
    ListModule.Settings.SupportsPolicyTips = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(340);
    ListModule.Settings.SupportsRightClickECB = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(249) || Flighting.VariantConfiguration.IsExpFeatureClientEnabled(383) && Flighting.VariantConfiguration.IsExpFeatureClientEnabled(104);
    ListModule.Settings.SupportsShortcutLink = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(563);
    ListModule.Settings.SupportsDoclibAccessibility = SPListView ? Flighting.VariantConfiguration.IsExpFeatureClientEnabled(169) : true;
    ListModule.Settings.SupportsDoclibQCB = SPListView ? Flighting.VariantConfiguration.IsExpFeatureClientEnabled(60) : true;
    bListViewSettingsInitialized = true;
}
var bListViewStringsInitialized;

function InitListViewStrings() {
    if (Boolean(bListViewStringsInitialized)) {
        return;
    }
    if (typeof window["ListView"] == "undefined") {
        window["ListView"] = new Object();
    }
    if (typeof window["ListView"]["Strings"] == "undefined") {
        if (SPListView && typeof Strings.STS != "undefined") {
            window["ListView"]["Strings"] = Strings.STS;
        }
        else if (typeof ListViewDefaults.Strings != "undefined") {
            window["ListView"]["Strings"] = ListViewDefaults.Strings;
        }
    }
    bListViewStringsInitialized = true;
}
var clientHierarchyManagers;

function OnExpandCollapseButtonClick(e) {
    for (var i = 0; i < clientHierarchyManagers.length; i++) {
        clientHierarchyManagers[i].ToggleExpandByImg(e.target.parentNode);
    }
    e.stopPropagation();
}
function GetClientHierarchyManagerForWebpart(wpq, bRtl) {
    for (var idx = 0; idx < clientHierarchyManagers.length; idx++) {
        if (clientHierarchyManagers[idx].Matches(wpq)) {
            return clientHierarchyManagers[idx];
        }
    }
    return new ClientHierarchyManager(wpq, bRtl);
}
var ClientHierarchyManager;

function EnterIPEAndDoAction(ctxIn, fn) {
    if (ListModule.Settings.SupportsInPlaceEdit) {
        if (ctxIn.AllowGridMode) {
            var spgantt = GetSPGanttFromCtx(ctxIn);

            if (spgantt != null) {
                fn(spgantt);
            }
            else {
                var gridInitInfo = g_SPGridInitInfo[ctxIn.view];

                gridInitInfo.fnCallback = function(newSPGantt) {
                    fn(newSPGantt);
                    gridInitInfo.fnCallback = null;
                };
                EnsureScriptParams('inplview', 'InitGridFromView', ctxIn.view, false);
            }
        }
    }
}
function IndentItems(ctxIn) {
    EnterIPEAndDoAction(ctxIn, function(spgantt) {
        spgantt.IndentItems(spgantt.get_SelectedItems());
    });
}
function OutdentItems(ctxIn) {
    EnterIPEAndDoAction(ctxIn, function(spgantt) {
        spgantt.OutdentItems(spgantt.get_SelectedItems());
    });
}
function InsertProvisionalItem(ctxIn) {
    EnterIPEAndDoAction(ctxIn, function(spgantt) {
        spgantt.InsertProvisionalItemBeforeFocusedItem();
    });
}
function MoveItemsUp(ctxIn) {
    EnterIPEAndDoAction(ctxIn, function(spgantt) {
        spgantt.MoveItemsUp(spgantt.get_ContiguousSelectedItemsWithoutEntryItems());
    });
}
function MoveItemsDown(ctxIn) {
    EnterIPEAndDoAction(ctxIn, function(spgantt) {
        spgantt.MoveItemsDown(spgantt.get_ContiguousSelectedItemsWithoutEntryItems());
    });
}
function CreateSubItem(ctxIn, itemId) {
    EnterIPEAndDoAction(ctxIn, function(spgantt) {
        spgantt.CreateSubItem(itemId);
    });
}
var SPClientRenderer;

function CallFunctionWithErrorHandling(fn, c, erv, execCtx) {
    if (SPClientRenderer.IsDebugMode(c)) {
        return fn();
    }
    try {
        return fn();
    }
    catch (e) {
        if (c.Errors == null)
            c.Errors = [];
        try {
            e.ExecutionContext = execCtx;
            if (Boolean(SPClientRenderer.AddCallStackInfoToErrors) && typeof execCtx == "object" && null != execCtx) {
                if (typeof ULSGetCallstack == "function") {
                    execCtx.CallStack = ULSGetCallstack(CallFunctionWithErrorHandling.caller);
                }
            }
        }
        catch (ignoreErr) { }
        c.Errors.push(e);
        return erv;
    }
}
function CoreRender(t, c) {
    var templateExecContext = {
        TemplateFunction: t,
        Operation: "CoreRender"
    };
    var fn = function() {
        return CoreRenderWorker(t, c);
    };

    return CallFunctionWithErrorHandling(fn, c, '', templateExecContext);
}
function CoreRenderWorker(t, c) {
    var tplFunc;

    if (typeof t == "string")
        tplFunc = SPClientRenderer.ParseTemplateString(t, c);
    else if (typeof t == "function")
        tplFunc = t;
    if (tplFunc == null)
        return '';
    return tplFunc(c);
}
function GetViewHash(renderCtx) {
    return Nav.ajaxNavigate.getParam("InplviewHash" + (renderCtx.view.toLowerCase()).substring(1, renderCtx.view.length - 1));
}
function RenderAsyncDataLoad(renderCtx) {
    return '<div style="padding-top:5px;"><center><img src="' + ListView.ImageBasePath + '/_layouts/15/images/gears_an.gif' + '" style="border-width:0px;" /></center></div>';
}
function RenderCallbackFailures(renderCtx, reqResponseText, reqStatus) {
    if (!Boolean(renderCtx)) {
        return;
    }
    if (reqStatus != 601) {
        return;
    }
    if (renderCtx["Errors"] == null) {
        renderCtx["Errors"] = [];
    }
    renderCtx["Errors"].push(reqResponseText);
    SPClientRenderer.Render(document.getElementById('script' + renderCtx.wpq), renderCtx);
}
function AsyncDataLoadPostRender(renderCtx) {
    if (ListModule.Settings.SupportsAsyncDataLoad) {
        window.asyncCallback = function() {
            ExecuteOrDelayUntilScriptLoaded(function() {
                if (typeof EnsureCLVP == "function" && Boolean(renderCtx.view)) {
                    EnsureCLVP(renderCtx);
                }
                var pagingString = renderCtx.clvp.PagingString(renderCtx.hasRootFolder ? 'RootFolder' : null);

                renderCtx.queryString = '?' + (pagingString != null ? pagingString : '');
                renderCtx.onRefreshFailed = RenderCallbackFailures;
                renderCtx.loadingAsyncData = true;
                var evtAjax = {
                    currentCtx: renderCtx,
                    csrAjaxRefresh: true
                };

                if (typeof inplview != "undefined" && typeof inplview.HandleRefreshView == "function") {
                    inplview.HandleRefreshView(evtAjax);
                }
            }, 'inplview.js');
        };
        if (typeof g_mdsReady != "undefined" && Boolean(g_mdsReady) && typeof g_MDSPageLoaded != "undefined" && !Boolean(g_MDSPageLoaded)) {
            _spBodyOnLoadFunctionNames.push('asyncCallback');
        }
        else {
            asyncCallback();
        }
    }
}
function AddPostRenderCallback(renderCtx, newCallback) {
    AddRenderCallback(renderCtx, 'OnPostRender', newCallback, false);
}
function AddPostRenderCallbackUnique(renderCtx, newCallback) {
    AddRenderCallback(renderCtx, 'OnPostRender', newCallback, true);
}
function AddRenderCallback(renderCtx, callbackType, newCallback, enforceUnique) {
    if (Boolean(renderCtx) && typeof newCallback == 'function' && callbackType != '') {
        var renderCallbacks = renderCtx[callbackType];

        if (renderCallbacks == null)
            renderCtx[callbackType] = newCallback;
        else if (typeof renderCallbacks == "function") {
            if (!Boolean(enforceUnique) || String(renderCallbacks) != String(newCallback)) {
                var array = [];

                array.push(renderCallbacks);
                array.push(newCallback);
                renderCtx[callbackType] = array;
            }
        }
        else if (typeof renderCallbacks == "object") {
            var exists = false;

            if (Boolean(enforceUnique)) {
                for (var i = 0; i < renderCallbacks.length; i++) {
                    if (renderCallbacks[i] == newCallback) {
                        exists = true;
                        break;
                    }
                }
            }
            if (!exists)
                renderCtx[callbackType].push(newCallback);
        }
    }
}
function InsertNodeAfter(refNode, nodeToInsert) {
    if (refNode == null || refNode.parentNode == null || nodeToInsert == null)
        return;
    var pNode = refNode.parentNode;
    var nextSib = refNode.nextSibling;

    if (nextSib == null)
        pNode.appendChild(nodeToInsert);
    else
        pNode.insertBefore(nodeToInsert, nextSib);
}
function GetRelativeDateTimeString(relativeDateTimeJSString) {
    var ret = null;
    var retTemplate = null;
    var codes = relativeDateTimeJSString.split('|');
    var strings = Boolean(window["ListView"]) && Boolean(window["ListView"]["Strings"]) ? window["ListView"]["Strings"] : Strings.STS;

    if (codes[0] == "0") {
        return relativeDateTimeJSString.substring(2);
    }
    var bFuture = codes[1] == "1";
    var timeBucket = codes[2];
    var timeValue = codes.length >= 4 ? codes[3] : null;
    var timeValue2 = codes.length >= 5 ? codes[4] : null;

    switch (timeBucket) {
    case "1":
        ret = bFuture ? strings["L_RelativeDateTime_AFewSecondsFuture"] : strings["L_RelativeDateTime_AFewSeconds"];
        break;
    case "2":
        ret = bFuture ? strings["L_RelativeDateTime_AboutAMinuteFuture"] : strings["L_RelativeDateTime_AboutAMinute"];
        break;
    case "3":
        retTemplate = GetLocalizedCountValue(bFuture ? strings["L_RelativeDateTime_XMinutesFuture"] : strings["L_RelativeDateTime_XMinutes"], bFuture ? strings["L_RelativeDateTime_XMinutesFutureIntervals"] : strings["L_RelativeDateTime_XMinutesIntervals"], Number(timeValue));
        break;
    case "4":
        ret = bFuture ? strings["L_RelativeDateTime_AboutAnHourFuture"] : strings["L_RelativeDateTime_AboutAnHour"];
        break;
    case "5":
        if (timeValue == null) {
            ret = bFuture ? strings["L_RelativeDateTime_Tomorrow"] : strings["L_RelativeDateTime_Yesterday"];
        }
        else {
            retTemplate = bFuture ? strings["L_RelativeDateTime_TomorrowAndTime"] : strings["L_RelativeDateTime_YesterdayAndTime"];
        }
        break;
    case "6":
        retTemplate = GetLocalizedCountValue(bFuture ? strings["L_RelativeDateTime_XHoursFuture"] : strings["L_RelativeDateTime_XHours"], bFuture ? strings["L_RelativeDateTime_XHoursFutureIntervals"] : strings["L_RelativeDateTime_XHoursIntervals"], Number(timeValue));
        break;
    case "7":
        if (timeValue2 == null) {
            ret = timeValue;
        }
        else {
            retTemplate = strings["L_RelativeDateTime_DayAndTime"];
        }
        break;
    case "8":
        retTemplate = GetLocalizedCountValue(bFuture ? strings["L_RelativeDateTime_XDaysFuture"] : strings["L_RelativeDateTime_XDays"], bFuture ? strings["L_RelativeDateTime_XDaysFutureIntervals"] : strings["L_RelativeDateTime_XDaysIntervals"], Number(timeValue));
        break;
    case "9":
        ret = strings["L_RelativeDateTime_Today"];
        break;
    }
    if (retTemplate != null) {
        ret = retTemplate.replace("{0}", timeValue);
        if (timeValue2 != null) {
            ret = ret.replace("{1}", timeValue2);
        }
    }
    return ret;
}
function GetLocalizedCountValue(locText, intervals, count) {
    if (locText == undefined || intervals == undefined || count == undefined) {
        return null;
    }
    var ret = '';
    var locIndex = -1;
    var intervalsArray = [];

    Array.addRange(intervalsArray, intervals.split('||'));
    for (var i = 0, lenght = intervalsArray.length; i < lenght; i++) {
        var interval = intervalsArray[i];

        if (interval == null || interval == "") {
            continue;
        }
        var subIntervalsArray = [];

        Array.addRange(subIntervalsArray, interval.split(','));
        for (var k = 0, subLength = subIntervalsArray.length; k < subLength; k++) {
            var subInterval = subIntervalsArray[k];

            if (subInterval == null || subInterval == "") {
                continue;
            }
            if (isNaN(Number(subInterval))) {
                if (subInterval.indexOf('-') != -1) {
                    var range = subInterval.split('-');

                    if (range == null || range.length !== 2) {
                        continue;
                    }
                    var min;
                    var max;

                    if (range[0] === '') {
                        min = 0;
                    }
                    else {
                        if (isNaN(Number(range[0]))) {
                            continue;
                        }
                        else {
                            min = parseInt(range[0]);
                        }
                    }
                    if (count >= min) {
                        if (range[1] === '') {
                            locIndex = i;
                            break;
                        }
                        else {
                            if (isNaN(Number(range[1]))) {
                                continue;
                            }
                            else {
                                max = parseInt(range[1]);
                            }
                        }
                        if (count <= max) {
                            locIndex = i;
                            break;
                        }
                    }
                }
                else if (subInterval.indexOf('*') != -1) {
                    var regexExpr = (subInterval.trim()).replace(/\*/g, '[0-9]*');
                    var regex = new RegExp('^' + regexExpr + '$');

                    if (regex.test(count.toString())) {
                        locIndex = i;
                        break;
                    }
                }
            }
            else {
                var exactNumber = parseInt(subInterval);

                if (count === exactNumber) {
                    locIndex = i;
                    break;
                }
            }
        }
        if (locIndex !== -1) {
            break;
        }
    }
    if (locIndex !== -1) {
        var locValues = locText.split('||');

        if (locValues != null && locValues[locIndex] != null && locValues[locIndex] != "") {
            ret = locValues[locIndex];
        }
    }
    return ret;
}
function GetDaysAfterToday(targetDate) {
    if (Boolean(window["_spRegionalSettings"])) {
        if (!('currentDateInLocalCalendar' in window["_spRegionalSettings"])) {
            return 0;
        }
        var now = window["_spRegionalSettings"]["currentDateInLocalCalendar"];

        if (now == null) {
            return 0;
        }
        var currentDateWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var date1 = targetDate.getTime();
        var date2 = currentDateWithoutTime.getTime();
        var difference = date1 - date2;

        return Math.floor(difference / 86400000);
    }
    return 0;
}
function ShouldCallSuiteExtensionControlFactory(renderCtx) {
    if (typeof renderCtx["allowedSuiteExtensionFileTypes"] != 'undefined' && IE8Support.arrayIndexOf(renderCtx["allowedSuiteExtensionFileTypes"], renderCtx.CurrentItem["File_x0020_Type"], 0) > -1 || !Boolean(renderCtx.CurrentItem["File_x0020_Type.mapapp"]) && !Boolean(renderCtx.CurrentItem["serverurl.progid"])) {
        return true;
    }
    return false;
}
var g_QCB_nextId;

function QCB(definition) {
    ;
    ;
    ;
    ;
    var rootElem = null;
    var rootId = "QCB" + String(g_QCB_nextId++);
    var isPolling = false;
    var renderer = new Renderer();

    renderer.SetTemplate("root", "{%version 2.0}\u003cdiv class=\"ms-qcb-root\" id=\"{=id}\"\u003e\u003cul class=\"ms-qcb-zone ms-qcb-leftzone\"\u003e\n                {%foreach item left}\n            \u003c/ul\u003e\u003cul class=\"ms-qcb-zone ms-qcb-rightzone\"\u003e\n                {%foreach item right}\n            \u003c/ul\u003e\u003chr class=\"ms-qcb-clearSeparator\" /\u003e\u003c/div\u003e");
    renderer.SetTemplate("item", "{%version 2.0}\u003cli class=\"ms-qcb-item\"\u003e\u003cbutton class=\"ms-qcb-button {=buttonClass}\" onclick=\"{+itemClick .}\" disabled=\"disabled\" type=\"button\" title=\"{=disabledTooltip}\" id=\"{=id}\" role=\"button\" aira-expanded=\"false\"\u003e\u003cspan class=\"ms-qcb-glyph {=glyphClass}\"\u003e{=glyph}\u003c/span\u003e{=title}\u003cspan class=\"ms-qcb-glyph {=rightGlyphClass}\"\u003e{=rightGlyph}\u003c/span\u003e\u003c/button\u003e\u003c/li\u003e");
    this.Poll = function() {
        if (isPolling)
            return;
        isPolling = true;
        rootElem = document.getElementById(rootId);
        if (!Boolean(rootElem)) {
            if (typeof definition.onDestroyed == "function") {
                definition.onDestroyed();
            }
            return;
        }
        var thisQCB = this;

        forEachButton(definition, function(button) {
            var pollResponseShouldDisable = !button.shouldEnable({
                "id": button.id
            });

            if (button.disabled !== pollResponseShouldDisable) {
                button.disabled = !button.disabled;
                var elem = document.getElementById(button.id);

                if (!Boolean(elem)) {
                    thisQCB._logError("QCB_ButtonElementNotFoundDuringPolling", "Could not find button with ID: '" + button.id + "' to set disabled state on. Button title: '" + button.title);
                    return;
                }
                setButtonState(elem, button);
            }
        });
        isPolling = false;
    };
    this.Render = function(containerElement) {
        if (rootElem !== null) {
            rootElem.parentNode.removeChild(rootElem);
            rootElem = null;
        }
        containerElement.innerHTML = renderer.Render("root", definition);
        rootElem = containerElement.firstChild;
        var thisQCB = this;

        forEachButton(definition, function(button) {
            if (Boolean(button.accessKey)) {
                var elem = document.getElementById(button.id);

                if (!Boolean(elem)) {
                    thisQCB._logError("QCB_ButtonNotFoundDuringRender", "Could not find button with ID: '" + button.id + "' to apply an access key to. Button title: '" + button.title);
                    return;
                }
                elem.setAttribute("accesskey", button.accessKey);
                setButtonState(elem, button);
            }
        });
        this.Poll();
    };
    this._logError = function(tag, message) {
        if (Boolean(definition.onError)) {
            definition.onError(tag, message);
        }
    };
    function forEachButton(def, fn) {
        var zone = def.left;
        var finished = false;

        while (true) {
            for (var i = 0; i < zone.length; i++) {
                var button = zone[i];

                fn(button);
            }
            if (finished)
                break;
            zone = def.right;
            finished = true;
        }
    }
    renderer.RegisterHandler("itemClick", function(evt, button) {
        button.onClick.call(this, evt);
    });
    prepareDefinitionForRender(definition);
    function prepareDefinitionForRender(def) {
        def.id = rootId;
        if (!Boolean(def.left))
            def.left = [];
        if (!Boolean(def.right))
            def.right = [];
        var nextId = 1;

        forEachButton(def, function(button) {
            button.disabled = true;
            button.id = rootId + "_Button" + String(nextId++);
            if (!Boolean(button.buttonClass))
                button.buttonClass = "";
            if (Boolean(def.buttonClass)) {
                if (button.buttonClass != "")
                    button.buttonClass += " ";
                button.buttonClass += def.buttonClass;
            }
            if (!Boolean(button.disabledTooltip))
                button.disabledTooltip = button.tooltip;
        });
    }
    function setButtonState(buttonElement, button) {
        var glyphs = buttonElement.getElementsByTagName("span");
        var numGlyphs;
        var idx;

        if (button.disabled) {
            buttonElement.setAttribute("disabled", "disabled");
            buttonElement.setAttribute("title", button.disabledTooltip);
            if (Boolean(definition.disabledClass)) {
                CSSUtil.AddClass(buttonElement, definition.disabledClass);
                for (idx = 0, numGlyphs = glyphs.length; idx < numGlyphs; idx++) {
                    CSSUtil.AddClass(glyphs[idx], definition.disabledClass);
                }
            }
        }
        else {
            buttonElement.removeAttribute("disabled");
            buttonElement.setAttribute("title", button.tooltip);
            if (Boolean(definition.disabledClass)) {
                CSSUtil.RemoveClass(buttonElement, definition.disabledClass);
                for (idx = 0, numGlyphs = glyphs.length; idx < numGlyphs; idx++) {
                    CSSUtil.RemoveClass(glyphs[idx], definition.disabledClass);
                }
            }
        }
    }
}
function IsFileExtensionControlsSupported() {
    if (!BrowserDetection.userAgent.ie8down && ListModule.Settings.SupportsFileExtensionControls)
        return true;
    return false;
}
function IsFileHandlerForAllNonOfficeFilesSupported() {
    if (!BrowserDetection.userAgent.ie8down && ListModule.Settings.SupportsFileHandlerForAllNonOfficeFiles)
        return true;
    return false;
}
function IsFileExtensionDataPipeSupported() {
    if (ListModule.Settings.SupportsFileExtensionDataPipe)
        return true;
    return false;
}
function IsFileHandlerAddInPickerSupported() {
    if (ListModule.Settings.SupportsFileHandlerAddInPicker)
        return true;
    return false;
}
function IsFileHandlerFileCreationSupported() {
    if (ListModule.Settings.SupportsFileHandlerFileCreation)
        return true;
    return false;
}
function IsTouchSupported() {
    return window.navigator.msMaxTouchPoints != null && window.navigator.msMaxTouchPoints > 0 || document.documentElement != null && 'ontouchstart' in document.documentElement;
}
function IsInfiniteScrollSupported(renderCtx) {
    return Boolean(renderCtx) && renderCtx.BaseViewID == 51 && !renderCtx.inGridMode && ListModule.Settings.SupportsInfiniteScroll && (renderCtx.ListTemplateType == 700 || Boolean(renderCtx.RealSiteTemplateId) && renderCtx.RealSiteTemplateId == 21) && !BrowserDetection.userAgent.ie8down && !(Boolean(renderCtx.ListSchema) && ListModule.Util.isDefinedAndNotNullOrEmpty(renderCtx.ListSchema.group1));
}
function SupportAjaxFolderNav(renderCtx) {
    return Boolean(renderCtx) && !renderCtx.inGridMode && (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(168) && renderCtx.ListTemplateType == 700 && renderCtx.BaseViewID == 51 || Flighting.VariantConfiguration.IsExpFeatureClientEnabled(424) && window["groupContextData"] != null && renderCtx.ListTemplateType == 101 && renderCtx.BaseViewID == 1);
}
function RenderListView(renderCtx, wpq, templateBody, bAnimation, bRenderHiddenFooter) {
    InitListViewFlightSettings();
    if (Boolean(renderCtx)) {
        if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(192) && renderCtx.bInitialRender) {
            var appCache = window.applicationCache;

            if (Boolean(appCache) && appCache.UNCACHED != appCache.status) {
                WriteStartDiagnostic("ListRendered_FromAppCacheStart");
            }
        }
        if (typeof standaloneCtx != "undefined") {
            standaloneCtx = renderCtx;
        }
        if (typeof SaveCurrentContextInfo == "function" && Boolean(renderCtx.SiteTemplateId)) {
            SaveCurrentContextInfo(renderCtx);
        }
        renderCtx.ListDataJSONItemsKey = 'Row';
        renderCtx.ControlMode = SPClientTemplates.ClientControlMode.View;
        SPClientTemplates.Utility.GetPropertiesFromPageContextInfo(renderCtx);
        if (!Boolean(renderCtx.bIncremental))
            renderCtx.Templates = SPClientTemplates.TemplateManager.GetTemplates(renderCtx);
        renderCtx.canDragUpload = CanDragUploadFile(renderCtx);
        LoadListContextData(renderCtx);
        if (renderCtx.Templates.Body == RenderGroupTemplateDefault)
            renderCtx.Templates.Body = RenderBodyTemplate;
        if (renderCtx.Templates.Header == '')
            renderCtx.Templates.Header = RenderHeaderTemplate;
        var oldFooterTemplate = renderCtx.Templates.Footer;
        var oldBodyTemplate = renderCtx.Templates.Body;
        var oldHeaderTemplate = renderCtx.Templates.Header;
        var oldViewTemplate = renderCtx.Templates.View;
        var postRenderFunc = function() {
            if (ListModule.Settings.SupportsDragDrop) {
                SetupDragDrop(renderCtx);
            }
        };

        AddPostRenderCallbackUnique(renderCtx, postRenderFunc);
        var postRender = renderCtx.OnPostRender;
        var preRender = renderCtx.OnPreRender;

        renderCtx.OnPostRender = null;
        if (Boolean(renderCtx.ListSchema) && renderCtx.ListSchema.IsDocLib) {
            EnableSharingDialogIfNeeded(renderCtx);
            DisplayExplorerWindowIfNeeded(renderCtx);
        }
        if (Boolean(renderCtx.ListSchema) && renderCtx.ListSchema.IsDocLib) {
            EnablePolicyTipDialogIfNeeded(renderCtx);
        }
        if (typeof EnableHeroButton == "function") {
            EnableHeroButton(renderCtx);
        }
        if (ListModule.Settings.SupportsAddToOneDrive && Number(renderCtx.ListTemplateType) == 700 && Number(renderCtx.BaseViewID) == 51) {
            EnableCreateMountPointIfNeeded(renderCtx);
        }
        renderCtx.Templates.Footer = '';
        if (Boolean(renderCtx.bInitialRender) && Boolean(renderCtx.AsyncDataLoad)) {
            renderCtx.OnPreRender = null;
            renderCtx.Templates.View = RenderAsyncDataLoad;
            renderCtx.Templates.Header = '';
            renderCtx.Templates.Body = '';
            renderCtx.Templates.Footer = '';
            renderCtx.OnPostRender = null;
            if (!Boolean(GetViewHash(renderCtx))) {
                renderCtx.OnPostRender = AsyncDataLoadPostRender;
            }
        }
        else {
            if (Boolean(renderCtx.bInitialRender) && Boolean(GetViewHash(renderCtx)))
                renderCtx.Templates.Body = '';
        }
        if (templateBody != null) {
            renderCtx.Templates.Header = '';
            if (bAnimation) {
                if (!Boolean(renderCtx.bNoDelete)) {
                    var firstTbody = templateBody.nextSibling;

                    while (firstTbody != null && firstTbody.nextSibling != null)
                        templateBody.parentNode.removeChild(firstTbody.nextSibling);
                }
                var oldHiddenValue = renderCtx.fHidden;

                renderCtx.fHidden = true;
                SPClientRenderer.Render(templateBody, renderCtx);
                renderCtx.fHidden = oldHiddenValue;
            }
            else {
                if (!Boolean(renderCtx.bNoDelete)) {
                    while (templateBody.nextSibling != null)
                        templateBody.parentNode.removeChild(templateBody.nextSibling);
                    var childNode = templateBody.lastChild;

                    while (childNode != null) {
                        templateBody.removeChild(childNode);
                        childNode = templateBody.lastChild;
                    }
                }
                SPClientRenderer.Render(templateBody, renderCtx);
            }
        }
        else {
            if (ListModule.Settings.SupportsTaskListEditMode) {
                RenderProjectTaskListEditMode(renderCtx, postRenderFunc);
                RenderGroupListEditMode(renderCtx, postRenderFunc);
            }
            SPClientRenderer.Render(document.getElementById('script' + wpq), renderCtx);
        }
        if (!Boolean(renderCtx.bInitialRender) || !Boolean(renderCtx.AsyncDataLoad)) {
            renderCtx.Templates.Body = '';
            renderCtx.Templates.Header = '';
            if (oldFooterTemplate == '')
                renderCtx.Templates.Footer = RenderFooterTemplate;
            else
                renderCtx.Templates.Footer = oldFooterTemplate;
            renderCtx.OnPreRender = null;
            renderCtx.OnPostRender = postRender;
            var oldCtxHidden = renderCtx.fHidden;

            renderCtx.fHidden = Boolean(bRenderHiddenFooter);
            SPClientRenderer.Render(document.getElementById('scriptPaging' + wpq), renderCtx);
            renderCtx.fHidden = oldCtxHidden;
        }
        renderCtx.Templates.View = oldViewTemplate;
        renderCtx.Templates.Body = oldBodyTemplate;
        renderCtx.Templates.Header = oldHeaderTemplate;
        renderCtx.Templates.Footer = oldFooterTemplate;
        renderCtx.OnPreRender = preRender;
        renderCtx.OnPostRender = postRender;
        if (renderCtx.bInitialRender || Boolean(renderCtx.startTime)) {
            WriteListViewSuccessLog(renderCtx);
        }
        if (typeof EnsureCLVP == "function" && Boolean(renderCtx.view)) {
            EnsureCLVP(renderCtx);
        }
    }
}
var SPClientTemplates;

function SPTemplateManagerResolveTypeInfo(rCtx) {
    if (rCtx != null) {
        this.defaultViewStyle = typeof rCtx.ViewStyle == "undefined";
        this.viewStyle = this.defaultViewStyle ? 'null' : rCtx.ViewStyle.toString();
        this.allLists = typeof rCtx.ListTemplateType == "undefined";
        this.ltype = this.allLists ? 'null' : rCtx.ListTemplateType.toString();
        this.allViews = typeof rCtx.BaseViewID == "undefined";
        this.viewId = this.allViews ? 'null' : rCtx.BaseViewID.toString();
    }
}
function SPTemplateManagerResolveTypeInfo_InitializePrototype() {
    SPTemplateManagerResolveTypeInfo.prototype = {
        defaultViewStyle: true,
        viewStyle: "",
        allLists: true,
        ltype: "",
        allViews: true,
        viewId: ""
    };
}
function SPTemplateManagerRegisterTypeInfo(rCtx) {
    if (rCtx != null) {
        this.defaultViewStyle = typeof rCtx.ViewStyle == "undefined";
        this.allLists = typeof rCtx.ListTemplateType == "undefined";
        this.allViews = typeof rCtx.BaseViewID == "undefined";
        if (!this.allLists) {
            if (typeof rCtx.ListTemplateType == "string" || typeof rCtx.ListTemplateType == "number")
                this.ltype = [rCtx.ListTemplateType.toString()];
            else
                this.ltype = rCtx.ListTemplateType;
        }
        if (!this.allViews) {
            if (typeof rCtx.BaseViewID == "string" || typeof rCtx.BaseViewID == "number")
                this.viewId = [rCtx.BaseViewID.toString()];
            else
                this.viewId = rCtx.BaseViewID;
        }
        if (!this.defaultViewStyle) {
            if (typeof rCtx.ViewStyle == "string" || typeof rCtx.ViewStyle == "number")
                this.viewStyle = [rCtx.ViewStyle.toString()];
            else
                this.viewStyle = rCtx.ViewStyle;
        }
    }
}
function SPTemplateManagerRegisterTypeInfo_InitializePrototype() {
    SPTemplateManagerRegisterTypeInfo.prototype = {
        defaultViewStyle: true,
        viewStyle: [],
        allLists: true,
        ltype: [],
        allViews: true,
        viewId: []
    };
}
function IsCSRReadOnlyTabularView(renderCtx) {
    return renderCtx != null && renderCtx.ListSchema != null && renderCtx.ListSchema.TabularView == "1" && renderCtx.inGridMode != true;
}
function SPClientFormUserValue() {
}
function SPClientFormUserValue_InitializePrototype() {
    SPClientFormUserValue.prototype.lookupId = '-1';
    SPClientFormUserValue.prototype.lookupValue = '';
    SPClientFormUserValue.prototype.displayStr = '';
    SPClientFormUserValue.prototype.email = '';
    SPClientFormUserValue.prototype.sip = '';
    SPClientFormUserValue.prototype.title = '';
    SPClientFormUserValue.prototype.picture = '';
    SPClientFormUserValue.prototype.department = '';
    SPClientFormUserValue.prototype.jobTitle = '';
    SPClientFormUserValue.prototype.initFromUserString = function(inStr) {
        if (inStr != null && inStr != '') {
            var userValues = inStr.split(SPClientTemplates.Utility.UserLookupDelimitString);

            if (userValues.length != 2)
                return;
            this.lookupId = userValues[0];
            var multiValStr = userValues[1];
            var splitStr = multiValStr.split(SPClientTemplates.Utility.UserMultiValueDelimitString);
            var numUserValues = splitStr.length;

            if (numUserValues == 1) {
                this.title = (this.displayStr = (this.lookupValue = splitStr[0]));
            }
            else if (numUserValues >= 5) {
                this.lookupValue = splitStr[0] == null ? '' : splitStr[0];
                this.displayStr = splitStr[1] == null ? '' : splitStr[1];
                this.email = splitStr[2] == null ? '' : splitStr[2];
                this.sip = splitStr[3] == null ? '' : splitStr[3];
                this.title = splitStr[4] == null ? '' : splitStr[4];
                if (numUserValues >= 6) {
                    this.picture = splitStr[5] == null ? '' : splitStr[5];
                    if (numUserValues >= 7) {
                        this.department = splitStr[6] == null ? '' : splitStr[6];
                        if (numUserValues >= 8)
                            this.jobTitle = splitStr[7] == null ? '' : splitStr[7];
                    }
                }
            }
        }
    };
    SPClientFormUserValue.prototype.toString = function() {
        var _lookupDelimitStr = SPClientTemplates.Utility.UserLookupDelimitString;
        var _multiValueDelimitStr = SPClientTemplates.Utility.UserMultiValueDelimitString;
        var uString = this.lookupId;

        uString += _lookupDelimitStr;
        uString += this.lookupValue;
        uString += _multiValueDelimitStr;
        uString += this.displayStr;
        uString += _multiValueDelimitStr;
        uString += this.email;
        uString += _multiValueDelimitStr;
        uString += this.sip;
        uString += _multiValueDelimitStr;
        uString += this.title;
        uString += _multiValueDelimitStr;
        uString += this.picture;
        uString += _multiValueDelimitStr;
        uString += this.department;
        uString += _multiValueDelimitStr;
        uString += this.jobTitle;
        return uString;
    };
}
function RenderViewTemplate(renderCtx) {
    var iStr = renderCtx.RenderHeader(renderCtx);

    iStr += renderCtx.RenderBody(renderCtx);
    iStr += renderCtx.RenderFooter(renderCtx);
    return iStr;
}
function RenderFieldValueDefault(renderCtx) {
    if (renderCtx != null && renderCtx.CurrentFieldValue != null)
        return renderCtx.CurrentFieldValue.toString();
    return '';
}
var RenderBodyTemplate;

function SuiteExtensionsDataRetrieval(addInType, successCallback, failureCallback) {
    var xmlHttp = new XMLHttpRequest();
    var err = new Error();

    if (xmlHttp == null) {
        WriteDebugLog("FileHandler_XmlHttpRequestObjectNull", true, "XmlHttpRequest object is null");
        return;
    }
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                var jsonResponse = JSON.parse(xmlHttp.responseText);

                WriteDebugLog("FileHandler_SuccessAzureDataPipe", false, "Successfully fetched add-in data from Azure, will try to set local storage now");
                WriteSuccess("FileHandler_SuccessAzureDataPipe");
                successCallback(addInType, jsonResponse["value"]);
            }
            else {
                WriteDebugLog("FileHandler_AzureDataPipe", true, "Correlation id is " + xmlHttp.getResponseHeader("SPRequestGuid"));
                if (xmlHttp.status == 503 || xmlHttp.status == 500) {
                    WriteDebugLog("FileHandler_AzureDataPipeStatus" + xmlHttp.status.toString(), true, "Failed to fetch add-in data, xmlhttp status is " + xmlHttp.status.toString());
                    WriteFailure("FileHandler_AzureDataPipeStatus" + xmlHttp.status.toString());
                    err.message = "Failed to fetch add-in data, xmlhttp status is " + xmlHttp.status.toString() + ", xmlhttp responsetext is " + xmlHttp.responseText;
                    failureCallback(err);
                }
                else {
                    WriteFailure("FileHandler_FailedAzureDataPipe");
                    err.message = "Failed to fetch add-in data, looks like an unknown failure, xmlhttp status is " + xmlHttp.status.toString() + ", xmlhttp responsetext is " + xmlHttp.responseText;
                    failureCallback(err);
                }
            }
        }
    };
    var webAbsoluteUrl = _spPageContextInfo["webAbsoluteUrl"] != null || _spPageContextInfo["webAbsoluteUrl"] != "undefined" ? _spPageContextInfo["webAbsoluteUrl"] : ListModule.Util.getHostUrl(window.location.href);
    var fileHandlerEndPoint = webAbsoluteUrl + "/_api/apps/GetByType('" + addInType + "')";

    xmlHttp.open("GET", fileHandlerEndPoint, true);
    xmlHttp.setRequestHeader("Accept", "application/json;odata=nometadata");
    WriteDebugLog("FileHandler_StartAzureDataPipe", false, "Trying to fetch add-in data from Azure, webAbsoluteUrl is - " + webAbsoluteUrl + ", fileHandlerEndPoint is - " + fileHandlerEndPoint);
    WriteStart("FileHandler_StartAzureDataPipe");
    try {
        xmlHttp.send("");
    }
    catch (e) {
        WriteDebugLog("FileHandler_AzureDataPipe", true, "Correlation id is " + xmlHttp.getResponseHeader("SPRequestGuid"));
        WriteFailure("FileHandler_FailedAzureDataPipe");
        failureCallback(e);
    }
}
function InitializeSuiteExtensions(renderCtx) {
    if (typeof SuiteExtensions == 'object' && typeof SuiteExtensions.HostConfig == 'function' && typeof SuiteExtensions.SuiteExtensionsDataStore == 'function' && typeof SuiteExtensions.SuiteExtensionsDataStore.Initialize == 'function') {
        InitializingSuiteExtensions(renderCtx);
    }
    else {
        EnsureScriptFunc("online/scripts/SuiteExtensions.js", "InitializeSuiteExtensionsJsFile", function() {
            InitializingSuiteExtensions(renderCtx);
        });
    }
}
function InitializingSuiteExtensions(renderCtx) {
    var currentUserId = "";

    if (typeof _spPageContextInfo !== "undefined") {
        currentUserId = _spPageContextInfo["userId"];
    }
    var hostConfig = new SuiteExtensions.HostConfig(currentUserId, SuiteExtensionsDataRetrieval);

    hostConfig.host = "SharePoint";
    hostConfig.set_logging(null);
    hostConfig.cultureName = renderCtx.CurrentCultureName;
    hostConfig.resourceId = renderCtx.HttpRoot;
    hostConfig.localizedStringsPath = "/_layouts/15/" + renderCtx.ListSchema.LCID + "/CloudApps/cloudapps_strings.js";
    if (IsFileExtensionDataPipeSupported()) {
        hostConfig.addFlight(SuiteExtensions.AddInsFlights.AzureDataPipe);
    }
    if (IsFileHandlerAddInPickerSupported()) {
        hostConfig.addFlight(SuiteExtensions.AddInsFlights.FileHandlerAddInPicker);
    }
    if (IsFileHandlerFileCreationSupported()) {
        hostConfig.addFlight(SuiteExtensions.AddInsFlights.FileHandlerFileCreation);
    }
    SuiteExtensions.SuiteExtensionsDataStore.Initialize(hostConfig);
}
function RenderGroupTemplateDefault(rCtx) {
    return rCtx != null && typeof rCtx.RenderGroups == "function" ? rCtx.RenderGroups(rCtx) : '';
}
function RenderItemTemplateDefault(rCtx) {
    return rCtx != null && typeof rCtx.RenderItems == "function" ? rCtx.RenderItems(rCtx) : '';
}
function RenderFieldTemplateDefault(rCtx) {
    return rCtx != null && typeof rCtx.RenderFields == "function" ? rCtx.RenderFields(rCtx) : '';
}
function RenderAggregate(renderCtx, groupId, listItem, listSchema, level, expand, aggregate) {
    var iStr = '';

    if (groupId == null) {
        iStr += '<tbody id="aggr';
        iStr += renderCtx.wpq;
        iStr += '">';
    }
    else {
        iStr = '<tbody id="aggr';
        iStr += groupId;
        iStr += '_"';
        if (!expand)
            iStr += ' style="display:none"';
        iStr += '>';
    }
    iStr += '<tr id="agg';
    iStr += renderCtx.wpq;
    iStr += '"><td/>';
    var aggLevel = '';

    if (level == 1)
        aggLevel = '.agg';
    else if (level == 2)
        aggLevel = '.agg2';
    var fields = listSchema.Field;

    for (var f in fields) {
        var field = fields[f];

        if (field.GroupField != null)
            break;
        iStr += '<td class="ms-vb2">';
        var type = aggregate[field.Name];

        if (type != null && type != '') {
            iStr += '<nobr><b>';
            var title;
            var aggName;

            if (type == 'COUNT') {
                title = window["ListView"]["Strings"]["L_SPCount"];
                aggName = field.Name + '.COUNT' + aggLevel;
            }
            if (type == 'SUM') {
                title = window["ListView"]["Strings"]["L_SPSum"];
                aggName = field.Name + '.SUM' + aggLevel;
            }
            else if (type == 'AVG') {
                title = window["ListView"]["Strings"]["L_SPAvg"];
                aggName = field.Name + '.AVG' + aggLevel;
            }
            else if (type == 'MAX') {
                title = window["ListView"]["Strings"]["L_SPMax"];
                aggName = field.Name + '.MAX' + aggLevel;
            }
            else if (type == 'MIN') {
                title = window["ListView"]["Strings"]["L_SPMin"];
                aggName = field.Name + '.MIN' + aggLevel;
            }
            else if (type == 'STDEV') {
                title = window["ListView"]["Strings"]["L_SPStdev"];
                aggName = field.Name + '.STDEV' + aggLevel;
            }
            else if (type == 'VAR') {
                title = window["ListView"]["Strings"]["L_SPVar"];
                aggName = field.Name + '.VAR' + aggLevel;
            }
            else {
                title = window["ListView"]["Strings"]["L_SPCount"];
                aggName = field.Name + '.COUNT' + aggLevel;
            }
            iStr += title;
            iStr += '=&nbsp;';
            iStr += Boolean(listItem) ? listItem[aggName] : "0";
            iStr += '</b></nobr>';
        }
        iStr += '</td>';
        if (IsCSRReadOnlyTabularView(renderCtx) && (field.CalloutMenu == "TRUE" || field.listItemMenu == "TRUE")) {
            iStr += '<td></td>';
        }
    }
    iStr += '</tr></tbody>';
    return iStr;
}
function RenderGroupTemplate(renderCtx, group, groupId, listItem, listSchema, level, expand) {
    renderCtx.CurrentItem = listItem;
    var viewCount = renderCtx.ctxId;
    var iStr = '<tbody id="titl';

    iStr += groupId;
    iStr += '" groupString="';
    iStr += listItem[group + '.urlencoded'];
    iStr += '"';
    if (level == 2 && !expand)
        iStr += ' style="display:none"';
    iStr += '><tr><td colspan="100" nowrap="nowrap" class="ms-gb';
    if (level == 2)
        iStr += '2';
    iStr += '">';
    if (level == 2)
        iStr += '<img src=' + ListView.ImageBasePath + '"/_layouts/15/images/blank.gif?rev=44"' + ' alt="" height="1" width="10">';
    iStr += '<a href="javascript:" onclick="javascript:ExpCollGroup(';
    iStr += "'";
    iStr += groupId;
    iStr += "', 'img_";
    iStr += groupId;
    iStr += "',event, false);return false;";
    iStr += '">';
    var groupOuterClass = null;
    var groupImgClass = null;

    if (DOM.rightToLeft) {
        groupOuterClass = expand ? "ms-commentcollapsertl-iconouter" : "ms-commentexpandrtl-iconouter";
        groupImgClass = expand ? "ms-commentcollapsertl-icon" : "ms-commentexpandrtl-icon";
    }
    else {
        groupOuterClass = expand ? "ms-commentcollapse-iconouter" : "ms-commentexpand-iconouter";
        groupImgClass = expand ? "ms-commentcollapse-icon" : "ms-commentexpand-icon";
    }
    var groupImgAlt = expand ? window["ListView"]["Strings"]["L_SPCollapse"] : window["ListView"]["Strings"]["L_SPExpand"];

    iStr += '<span class="';
    iStr += groupOuterClass;
    iStr += '"><img class="';
    iStr += groupImgClass;
    iStr += '" src="';
    iStr += GetThemedImageUrl("spcommon.png");
    iStr += '" alt="';
    iStr += groupImgAlt;
    iStr += '" id="img_';
    iStr += groupId;
    iStr += '" /></span>';
    var displayName = group;
    var curField;

    for (var idx = 0; idx < listSchema.Field.length; idx++) {
        var field = listSchema.Field[idx];

        if (field.Name == group) {
            displayName = field.DisplayName;
            curField = field;
            break;
        }
    }
    iStr += Encoding.HtmlEncode(displayName);
    iStr += '</a> : ';
    if (curField != null) {
        if (curField.Type == 'Number' || curField.Type == 'Currency')
            iStr += listItem[field.Name];
        else if (curField.Type == 'DateTime' && Boolean(listItem[field.Name + '.groupdisp']))
            iStr += listItem[field.Name + '.groupdisp'];
        else if (curField.Type == 'User' || curField.Type == 'UserMulti')
            iStr += listItem[field.Name + '.span'];
        else {
            renderCtx.CurrentItemIdx = idx;
            listItem[group + '.groupHeader'] = true;
            iStr += spMgr.RenderFieldByName(renderCtx, group, listItem, listSchema);
            delete listItem[group + '.groupHeader'];
            renderCtx.CurrentItemIdx = -1;
        }
    }
    iStr += ' <span style="font-weight: lighter; display: inline-block;">(';
    iStr += level == 2 ? listItem[group + '.COUNT.group2'] : listItem[group + '.COUNT.group'];
    iStr += ')</span></td></tr></tbody>';
    var aggregate = listSchema.Aggregate;

    if (aggregate != null && !renderCtx.inGridMode)
        iStr += RenderAggregate(renderCtx, groupId, listItem, listSchema, level, expand, aggregate);
    renderCtx.CurrentItem = null;
    return iStr;
}
function RenderGroup(renderCtx, listItem) {
    return RenderGroupEx(renderCtx, listItem, false);
}
function RenderGroupEx(renderCtx, listItem, omitLevel2) {
    var listSchema = renderCtx.ListSchema;
    var group1 = listSchema.group1;
    var group2 = listSchema.group2;
    var expand = listSchema.Collapse == null || listSchema.Collapse != "TRUE";
    var groupId = renderCtx.ctxId;
    var currCtx = typeof ctx != "undefined" ? ctx : renderCtx;
    var renderGroup = Boolean(currCtx.ExternalDataList);
    var iStr = "";
    var groupTpls = renderCtx.Templates['Group'];

    if (groupTpls == null || groupTpls == RenderItemTemplateDefault || typeof groupTpls != "function" && typeof groupTpls != "string")
        groupTpls = RenderGroupTemplate;
    else if (typeof groupTpls == "string")
        groupTpls = SPClientRenderer.ParseTemplateString(groupTpls, renderCtx);
    groupId += '-';
    groupId += listItem[group1 + '.groupindex'];
    if (listItem[group1 + '.newgroup'] == '1') {
        iStr += groupTpls(renderCtx, group1, groupId, listItem, listSchema, 1, expand);
    }
    if (listItem[group1 + '.newgroup'] == '1' || group2 != null && listItem[group2 + '.newgroup'] == '1') {
        if (group2 != null && !omitLevel2) {
            groupId += listItem[group2 + '.groupindex2'];
            iStr += groupTpls(renderCtx, group2, groupId, listItem, listSchema, 2, expand);
        }
        iStr += AddGroupBody(groupId, expand, renderGroup);
    }
    return iStr;
}
function AddGroupBody(groupId, expand, renderGroup) {
    var iStr = '<tbody id="tbod';

    iStr += groupId;
    iStr += '_"';
    if (!expand && renderGroup)
        iStr += ' style="display: none;"';
    iStr += ' isLoaded="';
    if (expand || renderGroup)
        iStr += 'true';
    else
        iStr += 'false';
    iStr += '"/>';
    return iStr;
}
function GenerateIID(renderCtx) {
    return GenerateIIDForListItem(renderCtx, renderCtx.CurrentItem);
}
function GenerateIIDForListItem(renderCtx, listItem) {
    return renderCtx.ctxId + ',' + listItem.ID + ',' + listItem.FSObjType;
}
function GetCSSClassForFieldTd(renderCtx, field) {
    var listSchema = renderCtx.ListSchema;

    if (field.CalloutMenu == 'TRUE' || renderCtx.inGridMode && (field.ClassInfo == 'Menu' || field.listItemMenu == 'TRUE'))
        return 'ms-cellstyle ms-vb-title';
    else if (field.ClassInfo == 'Menu' || field.listItemMenu == 'TRUE')
        return 'ms-cellstyle ms-vb-title ms-positionRelative';
    else if (field.ClassInfo == 'Icon')
        return 'ms-cellstyle ms-vb-icon';
    else if ((field.Type == 'User' || field.Type == 'UserMulti') && listSchema.EffectivePresenceEnabled)
        return 'ms-cellstyle ms-vb-user';
    else
        return 'ms-cellstyle ms-vb2';
}
function DoesListUseCallout(renderCtx) {
    for (var i = 0; i < renderCtx.ListSchema.Field.length; i++) {
        var field = renderCtx.ListSchema.Field[i];

        if (field.CalloutMenu != null && field.CalloutMenu.toLowerCase() == "true") {
            return true;
        }
    }
    return false;
}
function ShowCallOutOrECBWrapper(elm, evt, fShowCallout) {
    if (!ListModule.Settings.SupportsCallouts) {
        return false;
    }
    var fDoEventBubble = true;

    if (fShowCallout) {
        WriteEngagementLog("DocLib_RightClick");
        var srcElm = DOM_afterglass.GetParentLinkFromEvent(evt);

        if (srcElm != null && (srcElm.tagName == "A" || srcElm.parentNode.tagName == "A")) {
            WriteEngagementLog("DocLib_RightClickOnAnchor");
        }
        if (ShowCalloutMenuForTr != null) {
            fDoEventBubble = ShowCalloutMenuForTr(elm, evt, true);
        }
    }
    else {
        WriteEngagementLog("List_RightClick");
        if (ShowECBMenuForTr != null) {
            fDoEventBubble = ShowECBMenuForTr(elm, evt);
        }
    }
    return fDoEventBubble;
}
var RenderItemTemplate;

function RenderTableHeader(renderCtx) {
    var listSchema = renderCtx.ListSchema;
    var listData = renderCtx.ListData;
    var ret = [];

    RenderHeroButton(ret, renderCtx);
    if (Boolean(listSchema.InplaceSearchEnabled) && !PageMinimized()) {
        var controlDivId = 'CSRListViewControlDiv' + renderCtx.wpq;

        ret.push("<div class=\"ms-csrlistview-controldiv\" id=\"");
        ret.push(Encoding.HtmlEncode(controlDivId));
        ret.push("\">");
    }
    else
        ret.push("<div>");
    if (!PageMinimized()) {
        if (listSchema.RenderViewSelectorPivotMenu == "True")
            ret.push(RenderViewSelectorPivotMenu(renderCtx));
        else if (listSchema.RenderViewSelectorPivotMenuAsync == "True")
            ret.push(RenderViewSelectorPivotMenuAsync(renderCtx));
        var ManageListsPermission = renderCtx.BasePermissions.ManageLists;
        var ManagePersonalViewsPermission = renderCtx.BasePermissions.ManagePersonalViews;

        if (listSchema.RenderSaveAsNewViewButton == "True" && (ManageListsPermission || ManagePersonalViewsPermission != null && ManagePersonalViewsPermission)) {
            ret.push('<div id="CSRSaveAsNewViewDiv');
            ret.push(renderCtx.wpq);
            ret.push('" class="ms-InlineSearch-DivBaseline" style="visibility:hidden;padding-bottom:3px;"');
            ret.push('><a class="ms-commandLink" href="#" role="alert" id="CSRSaveAsNewViewAnchor');
            ret.push(renderCtx.wpq);
            ret.push('" saveViewButtonDisabled="false" onclick="EnsureScriptParams(\'inplview\', \'ShowSaveAsNewViewDialog\', \'');
            ret.push(renderCtx.listName + '\', \'');
            ret.push(renderCtx.view + '\', \'');
            ret.push(renderCtx.wpq + '\', \'');
            ret.push(ManageListsPermission + '\', \'');
            ret.push(ManagePersonalViewsPermission);
            ret.push('\'); return false;" >');
            var ss = window["ListView"]["Strings"]["L_SaveThisViewButton"];

            ret.push(ss.toUpperCase());
            ret.push('</a></div>');
        }
    }
    ret.push("</div>");
    ret.push('<iframe src="javascript:false;" id="FilterIframe');
    ret.push(renderCtx.ctxId);
    ret.push('" name="FilterIframe');
    ret.push(renderCtx.ctxId);
    ret.push('" style="display:none" height="0" width="0" FilterLink="');
    ret.push(listData.FilterLink);
    ret.push('"></iframe>');
    ret.push("<table onmousedown='return OnTableMouseDown(event);' summary=\"");
    ret.push(Encoding.HtmlEncode(renderCtx.ListTitle));
    ret.push('" xmlns:o="urn:schemas-microsoft-com:office:office" o:WebQuerySourceHref="');
    ret.push(renderCtx.HttPath);
    ret.push('&XMLDATA=1&RowLimit=0&View=');
    ret.push(URI_Encoding.encodeURIComponent(listSchema.View));
    ret.push('" border="0" cellspacing="0" dir="');
    ret.push(listSchema.Direction);
    ret.push('" onmouseover="EnsureSelectionHandler(event,this,');
    ret.push(renderCtx.ctxId);
    ret.push(')" cellpadding="1" id="');
    if (listSchema.IsDocLib || typeof listData.Row == 'undefined')
        ret.push("onetidDoclibViewTbl0");
    else {
        ret.push(renderCtx.listName);
        ret.push('-');
        ret.push(listSchema.View);
    }
    if (ListModule.Settings.SupportsDoclibAccessibility && listSchema.IsDocLib) {
        ret.push('" aria-label="' + Encoding.HtmlEncode(window["ListView"]["Strings"]["L_DocLibTable_Alt"]) + '" multi-selectable="true"');
    }
    ret.push('" class="');
    if (typeof listData.Row == 'undefined')
        ret.push('ms-emptyView');
    else
        ret.push("ms-listviewtable");
    if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(494)) {
        ret.push(' ms-odn-defaultFont');
    }
    var viewNoBraces = (listSchema.View.replace("{", "")).replace("}", "");

    ret.push('" view="');
    ret.push(viewNoBraces);
    ret.push('">');
    return ret.join('');
}
function RenderSelectAllCbx(renderCtx, ret) {
    if (ret == null) {
        ret = [];
    }
    ret.push('<span class="ms-selectall-span" tabindex="0" onfocus="EnsureSelectionHandlerOnFocus(event,this,');
    ret.push(renderCtx.ctxId);
    ret.push(');" id="cbxSelectAllItems');
    ret.push(renderCtx.ctxId);
    ret.push('" title="');
    ret.push(window["ListView"]["Strings"]["L_select_deselect_all"]);
    if (ListModule.Settings.SupportsDoclibAccessibility) {
        ret.push('" role="checkbox" aria-checked="false" aria-label="' + Encoding.HtmlEncode(window["ListView"]["Strings"]["L_select_deselect_all_alt"]));
    }
    ret.push('"><span tabindex="-1" class="ms-selectall-iconouter"><img class="ms-selectall-icon" alt="" src="');
    ret.push(GetThemedImageUrl("spcommon.png"));
    ret.push('"></img></span></span></span>');
    if (!IsInfiniteScrollSupported(renderCtx)) {
        SPClientRenderer.AddPostRenderCallback(renderCtx, function() {
            var selectAll = document.getElementById('cbxSelectAllItems' + renderCtx.ctxId);
            var evt = 'ontouchstart' in document.documentElement && !IsSupportedChromeOnWin() ? 'touchstart' : 'click';

            $addHandler(selectAll, evt, function() {
                selectAll.checked = !selectAll.checked;
                if (ListModule.Settings.SupportsItemSelection) {
                    WriteDocEngagementLog("Documents_SelectAllClick", "OneDrive_SelectAllClick");
                    ToggleAllItems(evt, selectAll, renderCtx.ctxId);
                }
            });
        });
    }
    return ret;
}
var RenderHeaderTemplate;
var RenderFooterTemplate;

function RenderViewSelectorMenu(renderCtx) {
    var openMenuText = Encoding.HtmlEncode(window["ListView"]["Strings"]["L_OpenMenu_Text"]);
    var viewSelectorMenuId = Encoding.HtmlEncode(renderCtx.wpq + '_LTViewSelectorMenu');
    var viewSelectorLinkId = Encoding.HtmlEncode(renderCtx.wpq + '_ListTitleViewSelectorMenu');
    var viewSelectorTopSpanId = Encoding.HtmlEncode(renderCtx.wpq + '_ListTitleViewSelectorMenu_t');
    var viewSelectorContainerId = Encoding.HtmlEncode(renderCtx.wpq + '_ListTitleViewSelectorMenu_Container');
    var currentViewTitle = renderCtx.viewTitle;

    if (currentViewTitle == null || currentViewTitle == '')
        currentViewTitle = window["ListView"]["Strings"]["L_ViewSelectorCurrentView"];
    var showMergeView = renderCtx.ListSchema.ViewSelector_ShowMergeView ? 'true' : 'false';
    var showRepairView = renderCtx.ListSchema.ViewSelector_ShowRepairView ? 'true' : 'false';
    var showCreateView = renderCtx.ListSchema.ViewSelector_ShowCreateView ? 'true' : 'false';
    var showEditView = renderCtx.ListSchema.ViewSelector_ShowEditView ? 'true' : 'false';
    var showApproveView = renderCtx.ListSchema.ViewSelector_ShowApproveView ? 'true' : 'false';
    var viewParameters = renderCtx.ListSchema.ViewSelector_ViewParameters;

    if (viewParameters == null)
        viewParameters = '';
    var onClick = [];

    onClick.push('onclick="try { CoreInvoke(\'showViewSelector\', event, document.getElementById(\'');
    onClick.push(viewSelectorContainerId);
    onClick.push('\'), { showRepairView : ');
    onClick.push(showRepairView);
    onClick.push(', showMergeView : ');
    onClick.push(showMergeView);
    onClick.push(', showEditView : ');
    onClick.push(showEditView);
    onClick.push(', showCreateView : ');
    onClick.push(showCreateView);
    onClick.push(', showApproverView : ');
    onClick.push(showApproveView);
    onClick.push(', listId: \'');
    onClick.push(renderCtx.listName);
    onClick.push('\', viewId: \'');
    onClick.push(renderCtx.view);
    onClick.push('\', viewParameters: \'');
    onClick.push(viewParameters);
    onClick.push('\' }); } catch (ex) { }; return false;" ');
    var onClickHandler = onClick.join('');
    var ret = [];

    ret.push('<span data-sp-cancelWPSelect="true" id="');
    ret.push(viewSelectorContainerId);
    ret.push('" class="ms-csrlistview-viewselectormenu"><span id="');
    ret.push(viewSelectorTopSpanId);
    ret.push('" class="ms-menu-althov ms-viewselector" title="');
    ret.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_ViewSelectorTitle"]));
    ret.push('" hoveractive="ms-menu-althov-active ms-viewselectorhover" hoverinactive="ms-menu-althov ms-viewselector" ');
    ret.push('foa="MMU_GetMenuFromClientId(\'');
    ret.push(viewSelectorLinkId);
    ret.push('\')" onmouseover="MMU_PopMenuIfShowing(this); MMU_EcbTableMouseOverOut(this, true)" ');
    ret.push('oncontextmenu="ClkElmt(this); return false;" ');
    ret.push(onClickHandler);
    ret.push('>');
    ret.push('<a class="ms-menu-a" id="');
    ret.push(viewSelectorLinkId);
    ret.push('" accesskey="');
    ret.push(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_SelectBackColorKey_TEXT"]));
    ret.push('" href="#" ');
    ret.push(onClickHandler);
    ret.push('oncontextmenu="ClkElmt(this); return false;" onfocus="MMU_EcbLinkOnFocusBlur(byid(\'');
    ret.push(viewSelectorMenuId);
    ret.push('\'), this, true);" oncontextmenu="ClkElmt(this); return false;" ');
    ret.push('onkeydown="MMU_EcbLinkOnKeyDown(byid(\'');
    ret.push(viewSelectorMenuId);
    ret.push('\'), MMU_GetMenuFromClientId(\'');
    ret.push(viewSelectorLinkId);
    ret.push('\'), event);" menutokenvalues="MENUCLIENTID=');
    ret.push(viewSelectorLinkId);
    ret.push(',TEMPLATECLIENTID=');
    ret.push(viewSelectorMenuId);
    ret.push('" serverclientid="');
    ret.push(viewSelectorLinkId);
    ret.push('"><span class="ms-viewselector-currentView">');
    ret.push(Encoding.HtmlEncode(currentViewTitle));
    ret.push('</span></a>');
    ret.push('<span style="height:');
    ret.push(4);
    ret.push('px;width:');
    ret.push(7);
    ret.push('px;position:relative;display:inline-block;overflow:hidden;" class="s4-clust ms-viewselector-arrow ms-menu-stdarw">');
    ret.push('<img src="');
    ret.push(ListView.ImageBasePath + "/_layouts/15/images/fgimg.png?rev=44");
    ret.push('" alt="');
    ret.push(openMenuText);
    ret.push('" style="border-width:0px;position:absolute;left:-');
    ret.push(0);
    ret.push('px !important;top:-');
    ret.push(262);
    ret.push('px !important;" /></span>');
    ret.push('<span style="height:');
    ret.push(4);
    ret.push('px;width:');
    ret.push(7);
    ret.push('px;position:relative;display:inline-block;overflow:hidden;" class="s4-clust ms-viewselector-arrow ms-menu-hovarw">');
    ret.push('<img src="');
    ret.push(ListView.ImageBasePath + "/_layouts/15/images/fgimg.png?rev=44");
    ret.push('" alt="');
    ret.push(openMenuText);
    ret.push('" style="border-width:0px;position:absolute;left:-');
    ret.push(0);
    ret.push('px !important;top:-');
    ret.push(266);
    ret.push('px !important;" /></span>');
    ret.push('</span></span>');
    return ret.join('');
}
function RenderViewSelectorPivotMenu(renderCtx) {
    var pivotOpts = {
        PivotContainerId: renderCtx.wpq + '_ListTitleViewSelectorMenu_Container'
    };
    var viewMenu = new ClientPivotControl(pivotOpts);
    var allOpts = renderCtx.ListSchema.ViewSelectorPivotMenuOptions;

    if (allOpts == null || allOpts == '')
        return '';
    var viewData = eval(renderCtx.ListSchema.ViewSelectorPivotMenuOptions);
    var idx;

    for (idx = 0; idx < viewData.length; idx++) {
        var viewOpt = viewData[idx];

        if (viewOpt.GroupId >= 500 || viewOpt.MenuOptionType != ClientPivotControl.MenuOptionType.MenuOption)
            break;
        viewOpt.SelectedOption = renderCtx.viewTitle == viewOpt.DisplayText;
        viewMenu.AddMenuOption(viewOpt);
    }
    if (idx > 0) {
        if (idx < 3)
            viewMenu.SurfacedPivotCount = idx;
        for (; idx < viewData.length; idx++) {
            var overflowItem = viewData[idx];

            if (overflowItem.MenuOptionType == ClientPivotControl.MenuOptionType.MenuOption) {
                overflowItem.SelectedOption = renderCtx.viewTitle == overflowItem.DisplayText;
                viewMenu.AddMenuOption(overflowItem);
            }
            else if (overflowItem.MenuOptionType == ClientPivotControl.MenuOptionType.MenuSeparator) {
                viewMenu.AddMenuSeparator();
            }
        }
    }
    return viewMenu.RenderAsString();
}
function RenderViewSelectorPivotMenuAsync(renderCtx) {
    var pivotOpts = {
        PivotContainerId: renderCtx.wpq + '_ListTitleViewSelectorMenu_Container'
    };
    var viewMenu = new ClientPivotControl(pivotOpts);

    viewMenu.SurfacedPivotCount = 1;
    var dispTitle = renderCtx.viewTitle;

    if (dispTitle == null || dispTitle == '')
        dispTitle = window["ListView"]["Strings"]["L_ViewSelectorCurrentView"];
    var curOpt = new ClientPivotControlMenuOption();

    curOpt.DisplayText = dispTitle;
    curOpt.OnClickAction = 'return false;';
    curOpt.SelectedOption = true;
    viewMenu.AddMenuOption(curOpt);
    viewMenu.OverflowMenuScript = "OpenViewSelectorPivotOptions(event, '" + renderCtx.ctxId + "'); return false;";
    return viewMenu.RenderAsString();
}
function OpenViewSelectorPivotOptions(evt, renderCtxId) {
    if (ListModule.Settings.SupportsViewSelectorPivot) {
        _OpenViewSelectorPivotOptions(evt, renderCtxId);
    }
}
function RenderEmptyText(ret, renderCtx) {
    if (renderCtx.inGridMode) {
        return;
    }
    var listData = renderCtx.ListData;

    if (listData.Row.length == 0) {
        var listSchema = renderCtx.ListSchema;
        var iStr = '<table class="';
        var hasSearchTerm = typeof renderCtx.completedSearchTerm != "undefined" && renderCtx.completedSearchTerm != null;

        iStr += 'ms-list-emptyText-compact ms-textLarge';
        iStr += '" dir="';
        iStr += listSchema.Direction;
        iStr += '" border="0">';
        iStr += '<tr id="empty-';
        iStr += renderCtx.wpq;
        iStr += '"><td colspan="99">';
        var listTemplate = renderCtx.ListTemplateType;

        if (hasSearchTerm) {
            iStr += window["ListView"]["Strings"]["L_NODOCSEARCH"];
        }
        else if (listSchema.IsDocLib) {
            var viewTitle = renderCtx.viewTitle;

            if (Boolean(viewTitle)) {
                var ss = window["ListView"]["Strings"]["L_NODOC"];

                iStr += ss.replace("%0", Encoding.HtmlEncode(viewTitle));
            }
            else
                iStr += window["ListView"]["Strings"]["L_NODOCView"];
        }
        else if (listTemplate == 160) {
            iStr += window["ListView"]["Strings"]["L_AccRqEmptyView"];
        }
        else {
            iStr += Encoding.HtmlEncode(listSchema.NoListItem);
        }
        iStr += '</td></tr></table>';
        ret.push(iStr);
    }
}
function RenderSearchStatus(ret, renderCtx) {
    ret.push('<tr><td>' + RenderSearchStatusInner(ret, renderCtx) + '</td></tr>');
}
function RenderSearchStatusInner(ret, renderCtx) {
    return '<div id="inplaceSearchDiv_' + renderCtx.wpq + '_lsstatus"></div>';
}
function RenderPaging(ret, renderCtx) {
    var listData = renderCtx.ListData;

    if (listData != null && (listData.PrevHref != null || listData.NextHref != null)) {
        var wpq = renderCtx.wpq;
        var listSchema = renderCtx.ListSchema;

        ret.push('<table border="0" cellpadding="0" cellspacing="0" class="ms-bottompaging" id="bottomPaging');
        ret.push(wpq);
        ret.push('"><tr><td class="ms-vb ms-bottompagingline" id="bottomPagingCell');
        if (!listSchema.groupRender) {
            ret.push(wpq);
            ret.push('" align="center">');
        }
        else
            ret.push('">');
        var str = [];
        var isRtl = window.document.documentElement.getAttribute("dir") == "rtl";

        str.push("<table><tr>");
        if (listData.PrevHref != null && !IsInfiniteScrollSupported(renderCtx)) {
            str.push("<td id=\"paging");
            str.push(wpq + "prev");
            str.push("\"><a title=\"");
            str.push(window["ListView"]["Strings"]["L_SPClientPrevious"]);
            str.push("\" onclick='RefreshPageTo(event, \"");
            str.push(listData.PrevHref);
            str.push("\");return false;'");
            str.push(" href=\"javascript:\" class=\"ms-commandLink ms-promlink-button ms-promlink-button-enabled\"><span class=\"ms-promlink-button-image\"><img src=\"");
            str.push(GetThemedImageUrl("spcommon.png"));
            str.push("\" border=\"0\" class=\"");
            if (isRtl)
                str.push("ms-promlink-button-right");
            else
                str.push("ms-promlink-button-left");
            str.push("\" alt=\"");
            str.push(window["ListView"]["Strings"]["L_SPClientPrevious"]);
            str.push("\"></a></td>");
        }
        str.push("<td class=\"ms-paging\">");
        if (!IsInfiniteScrollSupported(renderCtx)) {
            str.push(listData.FirstRow);
            str.push(" - ");
            str.push(listData.LastRow);
        }
        str.push("</td>");
        if (listData.NextHref != null) {
            str.push("<td ");
            if (IsInfiniteScrollSupported(renderCtx))
                str.push("style='display: none;' ");
            str.push("id=\"paging");
            str.push(wpq + "next");
            str.push("\"><a title=\"");
            str.push(window["ListView"]["Strings"]["L_SPClientNext"]);
            str.push("\" onclick='RefreshPageTo(event, \"");
            str.push(listData.NextHref);
            str.push("\");return false;'");
            str.push(" href=\"javascript:\" class=\"ms-commandLink ms-promlink-button ms-promlink-button-enabled\"><span class=\"ms-promlink-button-image\"><img src=\"");
            str.push(GetThemedImageUrl("spcommon.png"));
            str.push("\" border=\"0\" class=\"");
            if (isRtl)
                str.push("ms-promlink-button-left");
            else
                str.push("ms-promlink-button-right");
            str.push("\" alt=\"");
            str.push(window["ListView"]["Strings"]["L_SPClientNext"]);
            str.push("\"></a></td>");
        }
        str.push("</tr></table>");
        var pagingStr = str.join('');
        var topPagingCell = document.getElementById("topPagingCell" + wpq);

        if (topPagingCell != null) {
            topPagingCell.innerHTML = pagingStr;
        }
        ret.push(pagingStr);
        ret.push('</td></tr>');
        RenderSearchStatus(ret, renderCtx);
        ret.push('</table>');
    }
    else {
        ret.push('<table border="0" cellpadding="0" cellspacing="0" class="ms-bottompaging" id="bottomPaging">');
        RenderSearchStatus(ret, renderCtx);
        ret.push('</table>');
    }
}
function RenderPagingControlNew(ret, renderCtx, fRenderitemNumberRange, strClassName, strId) {
    var listData = renderCtx.ListData;
    var strTopDiv = "<div class=\"%CLASS_NAME%\" id=\"%ID_NAME%\" style=\"padding:2px;\" >";
    var strPrevNext = "<a onclick='RefreshPageTo(event, \"%PREV_OR_NEXT_PAGE%\");return false;' href=\"javascript:\" ><img alt=\"%PREV_OR_NEXT_ALT%\" src=\"%PREV_OR_NEXT_IMG%\" alt=\"\" /></a>";
    var strPageNums = "<span class=\"ms-paging\">%FIRST_ROW% - %LAST_ROW% </span>";

    ret.push((strTopDiv.replace(/%CLASS_NAME%/, strClassName)).replace(/%ID_NAME%/, strId));
    if (listData != null && (listData.PrevHref != null || listData.NextHref != null)) {
        var wpq = renderCtx.wpq;
        var listSchema = renderCtx.ListSchema;
        var strUrlPathToImg = ListView.ImageBasePath + "/_layouts/15/" + listSchema.LCID + "/images/";

        if (listData.PrevHref != null) {
            var strPrev = strPrevNext.replace(/%PREV_OR_NEXT_PAGE%/, listData.PrevHref);

            strPrev = strPrev.replace(/%PREV_OR_NEXT_IMG%/, strUrlPathToImg + "prev.gif");
            strPrev = strPrev.replace(/%PREV_OR_NEXT_ALT%/, window["ListView"]["Strings"]["L_SlideShowPrevButton_Text"]);
            ret.push(strPrev);
        }
        if (fRenderitemNumberRange) {
            ret.push((strPageNums.replace(/%FIRST_ROW%/, listData.FirstRow)).replace(/%LAST_ROW%/, listData.FirstRow));
        }
        if (listData.NextHref != null) {
            var strNext = strPrevNext.replace(/%PREV_OR_NEXT_PAGE%/, listData.NextHref);

            strNext = strNext.replace(/%PREV_OR_NEXT_IMG%/, strUrlPathToImg + "next.gif");
            strNext = strNext.replace(/%PREV_OR_NEXT_ALT%/, window["ListView"]["Strings"]["L_SlideShowNextButton_Text"]);
            ret.push(strNext);
        }
    }
    ret.push(RenderSearchStatusInner(ret, renderCtx));
    ret.push("</div>");
}
function RenderHeroParameters(renderCtx, delay) {
    if (renderCtx == null) {
        throw "Error: Ctx can not be null in RenderHeroParameters";
    }
    var listSchema = renderCtx.ListSchema;
    var wpq = renderCtx.wpq;

    this.isDocLib = listSchema.IsDocLib;
    this.listTemplate = renderCtx.ListTemplateType;
    this.WOPIEnabled = Boolean(renderCtx.NewWOPIDocumentEnabled);
    this.canUpload = ListModule.Util.canUploadFile(renderCtx);
    this.hasInlineEdit = renderCtx.AllowGridMode && !listSchema.IsDocLib && this.listTemplate != 123;
    this.canDragUpload = CanDragUploadFile(renderCtx);
    this.canEasyUpload = CanEasyUploadFile(renderCtx);
    this.wpq = wpq;
    var heroId = "idHomePageNewItem";
    var addNewText = window["ListView"]["Strings"]["L_SPAddNewItem"];
    var listTemplate = this.listTemplate;

    if (listTemplate == 104) {
        heroId = "idHomePageNewAnnouncement";
        addNewText = window["ListView"]["Strings"]["L_SPAddNewAnnouncement"];
    }
    else if (listTemplate == 101 || listTemplate == 700 || listTemplate == 702 || Flighting.VariantConfiguration.IsExpFeatureClientEnabled(365) && renderCtx.listBaseType == 1 && listTemplate >= 10000) {
        if (this.WOPIEnabled) {
            heroId = ListModule.Util.addWPQtoId('js-newdocWOPI-' + 'Hero', wpq);
        }
        else {
            heroId = "idHomePageNewDocument-" + wpq;
        }
        addNewText = window["ListView"]["Strings"]["L_SPAddNewDocument"];
    }
    else if (listTemplate == 115) {
        heroId = "idHomePageNewItem-" + wpq;
        addNewText = window["ListView"]["Strings"]["L_SPAddNewDocument"];
    }
    else if (listTemplate == 123) {
        addNewText = window["ListView"]["Strings"]["L_SPAddNewDocument"];
    }
    else if (listTemplate == 103) {
        heroId = "idHomePageNewLink";
        addNewText = window["ListView"]["Strings"]["L_SPAddNewLink"];
    }
    else if (listTemplate == 106) {
        heroId = "idHomePageNewEvent";
        addNewText = window["ListView"]["Strings"]["L_SPAddNewEvent"];
    }
    else if (listTemplate == 107 || listTemplate == 150 || listTemplate == 171) {
        addNewText = window["ListView"]["Strings"]["L_SPAddNewTask"];
    }
    else if (listTemplate == 109) {
        heroId = "idHomePageNewPicture";
        addNewText = window["ListView"]["Strings"]["L_SPAddNewPicture"];
    }
    else if (listTemplate == 119) {
        heroId = "idHomePageNewWikiPage";
        addNewText = window["ListView"]["Strings"]["L_SPAddNewWiki"];
    }
    else if (listTemplate == 1230) {
        addNewText = window["ListView"]["Strings"]["L_SPAddNewDevApp"];
    }
    else if (listTemplate == 330 || listTemplate == 332) {
        addNewText = window["ListView"]["Strings"]["L_SPAddNewApp"];
    }
    this.heroId = heroId;
    this.addNewText = addNewText;
    var url;

    if (ListModule.Settings.SupportsWebPageLibraryTemplate && listTemplate == 119) {
        url = renderCtx.HttpRoot + "/_layouts/15/CreateWebPage.aspx?List=" + renderCtx.listName + '&RootFolder=' + renderCtx.rootFolder;
    }
    else if (renderCtx.ListSchema.IsDocLib) {
        if (ListModule.Settings.SupportsUpload) {
            if (this.WOPIEnabled)
                url = "#";
            else {
                var mpQueryStrParams = null;

                if (Boolean(renderCtx.RealHttpRoot) && (mpQueryStrParams = ListModule.Util.makeMountedFolderQueryStrParams(true, false)) != null) {
                    url = renderCtx.RealHttpRoot + "/_layouts/15/Upload.aspx?List=" + renderCtx.listName + '&RootFolder=' + renderCtx.rootFolder + mpQueryStrParams;
                }
                else {
                    url = renderCtx.HttpRoot + "/_layouts/15/Upload.aspx?List=" + renderCtx.listName + '&RootFolder=' + renderCtx.rootFolder;
                }
            }
        }
    }
    else if (ListModule.Settings.SupportsDeveloperAppTemplate && listTemplate == 1230) {
        url = renderCtx.HttpRoot + "/_layouts/15/DeployDeveloperApp.aspx";
    }
    else {
        url = renderCtx.newFormUrl;
    }
    this.addNewUrl = url;
    this.largeSize = Boolean(listSchema.InplaceSearchEnabled) || listTemplate == 700 || Boolean(window["groupContextData"]) && listTemplate == 101;
}
function RenderHeroParameters_InitializePrototype() {
    RenderHeroParameters.prototype = {
        isDocLib: false,
        listTemplate: -1,
        canDragUpload: true,
        WOPIEnabled: false,
        hasInlineEdit: false,
        heroId: '',
        addNewText: '',
        addNewUrl: '',
        largeSize: false
    };
}
function IsInFilePickerMode(renderCtx) {
    return Flighting.VariantConfiguration.IsExpFeatureClientEnabled(513) && Boolean(renderCtx.QCBDisabled);
}
function RenderHeroLink(renderCtx, delay) {
    var isCustomListInGroup = Flighting.VariantConfiguration.IsExpFeatureClientEnabled(437) && renderCtx.SiteTemplateId == 64 && renderCtx.listTemplate == "100";

    if (!isCustomListInGroup && renderCtx.inGridMode) {
        var slink = "<a class=\"ms-heroCommandLink\" href=\"javascript:;\" onclick=\"ExitGrid('";

        slink += renderCtx.view;
        slink += "'); return false;\"";
        slink += " title=";
        slink += Encoding.AttrQuote(window["ListView"]["Strings"]["L_SPStopEditingTitle"]);
        slink += ">";
        var ss = window["ListView"]["Strings"]["L_SPStopEditingList"];

        return (ss.replace(/{(1)}/, "</a>")).replace(/{(0)}/, slink);
    }
    var heroParam = new RenderHeroParameters(renderCtx, delay);

    if (!Boolean(heroParam) || IsInFilePickerMode(renderCtx))
        return "";
    renderCtx.heroId = heroParam.heroId;
    var retString;

    if (isCustomListInGroup && ListModule.Settings.SupportsDoclibQCB) {
        WriteEngagementLog("GroupCustomListQCB_StartCreate");
        WriteDebugLog("GroupCustomListQCB_StartCreate", false, "Starting construction of group's custom list QCB for " + renderCtx.wpq);
        renderCtx.qcbNewButtonConfigured = false;
        var qcbDef;

        if (!Flighting.VariantConfiguration.IsExpFeatureClientEnabled(249)) {
            qcbDef = {
                "buttonClass": (heroParam.largeSize ? "ms-textXLarge" : "ms-textLarge") + " ms-heroCommandLink js-qcb-button",
                "disabledClass": "ms-disabled",
                "onDestroyed": function() {
                    OnQCBDestroyed(renderCtx);
                },
                "onError": function(tag, message) {
                    WriteDebugLog(tag, true, message + " - GroupCustomListQCB for " + renderCtx.wpq);
                },
                "left": [{
                    "title": window["ListView"]["Strings"]["L_SPClientNew"],
                    "glyphClass": (heroParam.largeSize ? "ms-listview-old-new-glyph-large " : "") + "ms-listview-glyph ms-listview-old-new-glyph ms-listview-old-new-glyph-circle",
                    "glyph": "&#xE004;",
                    "buttonClass": "js-listview-qcbNewButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientNewTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientNewAK"],
                    "onClick": function(evt) {
                        HandleQCBNewButtonPress(evt, heroParam);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBNewButton(buttonInfo, renderCtx, heroParam);
                    }
                }, renderCtx.inGridMode ? {
                    "title": window["ListView"]["Strings"]["L_SPQCB_StopEditList_Text"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE027;",
                    "buttonClass": "js-listview-qcbEditListButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPQCB_StopEditList_Tooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPQCB_StopEditListAK"],
                    "onClick": function(evt) {
                        HandleQCBStopEditListButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBStopEditListButton(buttonInfo, renderCtx);
                    }
                } : {
                    "title": window["ListView"]["Strings"]["L_SPQCB_EditList_Text"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE027;",
                    "buttonClass": "js-listview-qcbEditListButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPEditListTitle"],
                    "accessKey": window["ListView"]["Strings"]["L_SPQCB_EditListAK"],
                    "onClick": function(evt) {
                        HandleQCBEditListButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBEditListButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPQCB_ListSettings_Text"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE035;",
                    "buttonClass": "ms-qcb-buttons-alignmentfix js-listview-qcbListSettingsButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPQCB_ListSettings_Tooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPQCB_ListSettings_AK"],
                    "onClick": function(evt) {
                        HandleQCBListSettingsButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBListSettingsButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPClientManage"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE077;",
                    "buttonClass": "js-listview-qcbManageButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientManageTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientManageAK"],
                    "onClick": function(evt) {
                        HandleQCBManageButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBManageButton(buttonInfo, renderCtx);
                    }
                }]
            };
        }
        else {
            qcbDef = {
                "buttonClass": "js-callout-body js-qcb-button",
                "disabledClass": "ms-disabled",
                "onDestroyed": function() {
                    OnQCBDestroyed(renderCtx);
                },
                "onError": function(tag, message) {
                    WriteDebugLog(tag, true, message + " - GroupCustomListQCB for " + renderCtx.wpq);
                },
                "left": [{
                    "title": window["ListView"]["Strings"]["L_SPQCB_New_Text"],
                    "glyphClass": "ms-listview-glyph-withmargin ms-core-form-heading ms-listview-new-glyph ms-listview-new-glyph-circle",
                    "glyph": "&#xE004;",
                    "buttonClass": "js-listview-qcbNewButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientNewTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientNewAK"],
                    "onClick": function(evt) {
                        HandleQCBNewButtonPress(evt, heroParam);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBNewButton(buttonInfo, renderCtx, heroParam);
                    }
                }, renderCtx.inGridMode ? {
                    "title": window["ListView"]["Strings"]["L_SPQCB_StopEditList_Text"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE027;",
                    "buttonClass": "js-listview-qcbStopEditListButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPQCB_StopEditList_Tooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPQCB_StopEditListAK"],
                    "onClick": function(evt) {
                        HandleQCBStopEditListButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBStopEditListButton(buttonInfo, renderCtx);
                    }
                } : {
                    "title": window["ListView"]["Strings"]["L_SPQCB_EditList_Text"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE027;",
                    "buttonClass": "js-listview-qcbEditListButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPEditListTitle"],
                    "accessKey": window["ListView"]["Strings"]["L_SPQCB_EditListAK"],
                    "onClick": function(evt) {
                        HandleQCBEditListButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBEditListButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPQCB_ListSettings_Text"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE035;",
                    "buttonClass": "ms-qcb-buttons-alignmentfix js-listview-qcbListSettingsButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPQCB_ListSettings_Tooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPQCB_ListSettings_AK"],
                    "onClick": function(evt) {
                        HandleQCBListSettingsButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBListSettingsButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPQCB_More_Text"],
                    "rightGlyphClass": "ms-listview-manage-glyph ms-toolbar",
                    "rightGlyph": "&#xE088;",
                    "buttonClass": "ms-qcb-buttons-alignmentfix js-listview-qcbManageButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientManageTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientManageAK"],
                    "onClick": function(evt) {
                        HandleQCBManageButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBManageButton(buttonInfo, renderCtx);
                    }
                }]
            };
        }
        renderCtx.qcb = new QCB(qcbDef);
        retString = "<div class=\"ms-listview-qcbContainer\"></div>";
        AddPostRenderCallback(renderCtx, RenderDocumentLibraryQCB);
        WriteEngagementLog("GroupCustomListQCB_SuccessCreate");
        WriteDebugLog("GroupCustomListQCB_SuccessCreate", false, "Succeeded constructing custom list QCB for " + renderCtx.wpq);
    }
    else if (heroParam.isDocLib && !renderCtx.inGridMode && ListModule.Settings.SupportsDoclibQCB) {
        WriteEngagementLog("DocLibQCB_StartCreate");
        WriteDebugLog("DocLibQCB_StartCreate", false, "Starting construction of a QCB for " + renderCtx.wpq);
        renderCtx.qcbNewButtonConfigured = false;
        var uploadUrl = null;
        var mpQueryStrParams = null;

        if (Boolean(renderCtx.RealHttpRoot) && (mpQueryStrParams = ListModule.Util.makeMountedFolderQueryStrParams(true, false)) != null) {
            uploadUrl = renderCtx.RealHttpRoot + "/_layouts/15/Upload.aspx" + '?List=' + renderCtx.listName + '&RootFolder=' + renderCtx.rootFolder + mpQueryStrParams;
        }
        else {
            uploadUrl = renderCtx.HttpRoot + "/_layouts/15/Upload.aspx" + '?List=' + renderCtx.listName + '&RootFolder=' + renderCtx.rootFolder;
        }
        if (!Flighting.VariantConfiguration.IsExpFeatureClientEnabled(249)) {
            qcbDef = {
                "buttonClass": (heroParam.largeSize ? "ms-textXLarge" : "ms-textLarge") + " ms-heroCommandLink js-qcb-button",
                "disabledClass": "ms-disabled",
                "onDestroyed": function() {
                    OnQCBDestroyed(renderCtx);
                },
                "onError": function(tag, message) {
                    WriteDebugLog(tag, true, message + " - DocumentLibraryQCB for " + renderCtx.wpq);
                },
                "left": [{
                    "title": window["ListView"]["Strings"]["L_SPClientNew"],
                    "glyphClass": (heroParam.largeSize ? "ms-listview-old-new-glyph-large " : "") + "ms-listview-glyph ms-listview-old-new-glyph ms-listview-old-new-glyph-circle",
                    "glyph": "&#xE004;",
                    "buttonClass": "js-listview-qcbNewButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientNewTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientNewAK"],
                    "onClick": function(evt) {
                        HandleQCBNewButtonPress(evt, heroParam);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBNewButton(buttonInfo, renderCtx, heroParam);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPClientUpload"],
                    "glyphClass": "ms-listview-glyph ms-listview-old-upload-glyph",
                    "glyph": "&#xE076;",
                    "buttonClass": "js-listview-qcbUploadButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientUploadTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientUploadAK"],
                    "onClick": function(evt) {
                        HandleQCBUploadButtonPress(evt, uploadUrl, heroParam);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBUploadButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPClientSync"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE034;",
                    "buttonClass": "js-listview-qcbSyncButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientSyncTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientSyncAK"],
                    "onClick": function(evt) {
                        HandleQCBSyncButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBSyncButton(buttonInfo, heroParam, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPClientEdit"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE027;",
                    "buttonClass": "js-listview-qcbEditButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientEditTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientEditAK"],
                    "onClick": function(evt) {
                        HandleQCBEditButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBEditButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPClientManage"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE077;",
                    "buttonClass": "js-listview-qcbManageButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientManageTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientManageAK"],
                    "onClick": function(evt) {
                        HandleQCBManageButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBManageButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPClientShare"],
                    "glyphClass": "ms-listview-glyph",
                    "glyph": "&#xE078;",
                    "buttonClass": "js-listview-qcbShareButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientShareTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientShareAK"],
                    "onClick": function(evt) {
                        HandleQCBShareButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBShareButton(buttonInfo, renderCtx);
                    }
                }]
            };
        }
        else {
            qcbDef = {
                "buttonClass": "js-callout-body js-qcb-button",
                "disabledClass": "ms-disabled",
                "onDestroyed": function() {
                    OnQCBDestroyed(renderCtx);
                },
                "onError": function(tag, message) {
                    WriteDebugLog(tag, true, message + " - DocumentLibraryQCB for " + renderCtx.wpq);
                },
                "left": [{
                    "title": window["ListView"]["Strings"]["L_SPQCB_New_Text"],
                    "glyphClass": "ms-listview-glyph-withmargin ms-core-form-heading ms-listview-new-glyph ms-listview-new-glyph-circle",
                    "glyph": "&#xE004;",
                    "buttonClass": "js-listview-qcbNewButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientNewTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientNewAK"],
                    "onClick": function(evt) {
                        HandleQCBNewButtonPress(evt, heroParam);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBNewButton(buttonInfo, renderCtx, heroParam);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPQCB_Upload_Text"],
                    "glyphClass": "ms-listview-glyph-withmargin ms-core-form-heading",
                    "glyph": "&#xE076;",
                    "buttonClass": "ms-qcb-buttons-alignmentfix js-listview-qcbUploadButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientUploadTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientUploadAK"],
                    "onClick": function(evt) {
                        HandleQCBUploadButtonPress(evt, uploadUrl, heroParam);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBUploadButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPQCB_Sync_Text"],
                    "glyphClass": "ms-listview-glyph-withmargin ms-listview-sync-glyph ms-core-form-heading",
                    "glyph": "&#xE034;",
                    "buttonClass": "ms-qcb-buttons-alignmentfix js-listview-qcbSyncButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientSyncTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientSyncAK"],
                    "onClick": function(evt) {
                        HandleQCBSyncButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBSyncButton(buttonInfo, heroParam, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPQCB_Share_Text"],
                    "glyphClass": "ms-listview-glyph-withmargin ms-core-form-heading",
                    "glyph": "&#xE078;",
                    "buttonClass": "ms-qcb-buttons-alignmentfix js-listview-qcbShareButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientShareTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientShareAK"],
                    "onClick": function(evt) {
                        HandleQCBShareButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBShareButton(buttonInfo, renderCtx);
                    }
                }, {
                    "title": window["ListView"]["Strings"]["L_SPQCB_More_Text"],
                    "rightGlyphClass": "ms-listview-manage-glyph ms-toolbar",
                    "rightGlyph": "&#xE088;",
                    "buttonClass": "ms-qcb-buttons-alignmentfix js-listview-qcbManageButton",
                    "tooltip": window["ListView"]["Strings"]["L_SPClientManageTooltip"],
                    "accessKey": window["ListView"]["Strings"]["L_SPClientManageAK"],
                    "onClick": function(evt) {
                        HandleQCBManageButtonPress(evt, renderCtx);
                    },
                    "shouldEnable": function(buttonInfo) {
                        return ShouldEnableQCBManageButton(buttonInfo, renderCtx);
                    }
                }]
            };
        }
        if (!heroParam.largeSize) {
            qcbDef.left.splice(2, 1);
            qcbDef.left.splice(3, 1);
        }
        else if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(478) && window["groupContextData"] != null) {
            qcbDef.left.splice(2, 1);
        }
        else {
            if (ListModule.Settings.SupportsAddToOneDrive && ListModule.Settings.SupportsAddToOneDriveQCB && !Boolean(renderCtx.RealHttpRoot) && heroParam.listTemplate == 101) {
                var addToOneDriveQCB;

                if (!Flighting.VariantConfiguration.IsExpFeatureClientEnabled(249)) {
                    addToOneDriveQCB = {
                        "title": window["ListView"]["Strings"]["L_SPClientAddToOneDrive"],
                        "glyphClass": "ms-listview-glyph",
                        "glyph": "&#xE168;",
                        "buttonClass": "js-listview-qcbAddToOneDriveButton",
                        "tooltip": window["ListView"]["Strings"]["L_SPClientAddToOneDriveTooltip"],
                        "accessKey": window["ListView"]["Strings"]["L_SPClientAddToOneDriveAK"],
                        "onClick": function(evt) {
                            HandleQCBAddToOneDriveButtonPress(evt, renderCtx);
                        },
                        "shouldEnable": function(buttonInfo) {
                            return ShouldEnableQCBAddToOneDriveButton(buttonInfo, heroParam, renderCtx);
                        }
                    };
                }
                else {
                    addToOneDriveQCB = {
                        "title": window["ListView"]["Strings"]["L_SPQCB_SPClientAddToOneDrive"],
                        "glyphClass": "ms-listview-glyph-withmargin ms-core-form-heading",
                        "glyph": "&#xE168;",
                        "buttonClass": "ms-qcb-buttons-alignmentfix js-listview-qcbAddToOneDriveButton",
                        "tooltip": window["ListView"]["Strings"]["L_SPClientAddToOneDriveTooltip"],
                        "accessKey": window["ListView"]["Strings"]["L_SPClientAddToOneDriveAK"],
                        "onClick": function(evt) {
                            HandleQCBAddToOneDriveButtonPress(evt, renderCtx);
                        },
                        "shouldEnable": function(buttonInfo) {
                            return ShouldEnableQCBAddToOneDriveButton(buttonInfo, heroParam, renderCtx);
                        }
                    };
                }
                qcbDef.left.splice(2, 1, addToOneDriveQCB);
            }
        }
        renderCtx.qcb = new QCB(qcbDef);
        retString = "<div class=\"ms-listview-qcbContainer\"></div>";
        AddPostRenderCallback(renderCtx, RenderDocumentLibraryQCB);
        WriteDebugLog("DocLibQCB_SuccessCreate", false, "Succeeded constructing a QCB for " + renderCtx.wpq);
    }
    else {
        if (heroParam.isDocLib && !renderCtx.inGridMode) {
            WriteEngagementLog("DocLibQCB_NotShownExpected");
        }
        var newLink = isCustomListInGroup ? null : RenderHeroAddNewLink(heroParam, renderCtx);

        if (heroParam.isDocLib && heroParam.listTemplate != 119 && heroParam.canDragUpload && Boolean(newLink)) {
            retString = window["ListView"]["Strings"]["L_SPAddNewAndDrag"];
            retString = retString.replace(/{(0)}/, newLink);
        }
        else if (!heroParam.isDocLib && heroParam.hasInlineEdit) {
            var aTag = "<a class=\"ms-heroCommandLink\" href=\"javascript:;\" onclick=\"EnsureScriptParams('inplview', 'InitGridFromView', '";

            aTag += renderCtx.view;
            aTag += "'); return false;\"";
            aTag += " title=\"";
            aTag += window["ListView"]["Strings"]["L_SPEditListTitle"];
            aTag += "\">";
            if (Boolean(newLink)) {
                retString = window["ListView"]["Strings"]["L_SPAddNewAndEdit"];
                retString = ((retString.replace(/{(0)}/, newLink)).replace(/{(1)}/, aTag)).replace(/{(2)}/, '</a>');
            }
            else {
                retString = window["ListView"]["Strings"]["L_SPEditList"];
                retString = (retString.replace(/{(0)}/, aTag)).replace(/{(1)}/, '</a>');
            }
        }
        else {
            retString = newLink;
        }
    }
    if (heroParam.canEasyUpload) {
        retString += RenderEasyUploadInputFileElement(renderCtx);
    }
    return retString;
}
function RenderDocumentLibraryQCB(renderCtx) {
    WriteStart("DocLibQCB_StartRender");
    WriteDebugLog("DocLibQCB_StartRender", false, "Starting rendering of a QCB for " + renderCtx.wpq);
    var containerElement = document.querySelector("#Hero-" + renderCtx.wpq + " .ms-listview-qcbContainer");

    if (!Boolean(containerElement)) {
        WriteFailure("DocLibQCB_ContainerNotFound");
        WriteDebugLog("DocLibQCB_ContainerNotFound", true, "Expected selector: '#Hero-" + renderCtx.wpq + " .ms-listview-qcbContainer");
        return;
    }
    if (!Boolean(renderCtx.qcb)) {
        WriteFailure("DocLibQCB_QCBObjectUndefined");
        WriteDebugLog("DocLibQCB_QCBObjectUndefined", true, "The QCB object on the renderCtx for " + renderCtx.wpq + " is null or undefined");
        return;
    }
    renderCtx.qcb.Render(containerElement);
    if (ListModule.Settings.SupportsQCB) {
        if (typeof _registerOnItemSelectionChangedHandlerForQCB == "function") {
            _registerOnItemSelectionChangedHandlerForQCB(renderCtx);
        }
    }
    WriteSuccess("DocLibQCB_SuccessRender");
    WriteDebugLog("DocLibQCB_SuccessRender", false, "Succeeded rendering a QCB for " + renderCtx.wpq);
}
function OnQCBDestroyed(renderCtx) {
    WriteDebugLog("DocLibQCB_OnDestroyed", false, "QCB for " + renderCtx.wpq + " has been destroyed. Cleaning up.");
    if (ListModule.Settings.SupportsQCB) {
        if (typeof _unregisterOnItemSelectionChangedHandlerForQCB == "function") {
            _unregisterOnItemSelectionChangedHandlerForQCB(renderCtx);
        }
    }
    WriteDebugLog("DocLibQCB_OnDestroyedSucceeded", false, "Successfully cleaned up QCB for " + renderCtx.wpq + " that had been destroyed.");
}
function CloseAllMenusAndCallouts() {
    if (typeof MenuHtc_hide != "undefined")
        MenuHtc_hide();
    if (ListModule.Settings.SupportsCallouts) {
        if (typeof CalloutManager != "undefined")
            CalloutManager.closeAll();
    }
    WriteDebugLog("DocLibQCB_CloseAllMenusAndCallouts", false, "Successfully closed all Menus and Callouts.");
}
function ShouldEnableQCBNewButton(buttonInfo, renderCtx, heroParam) {
    WriteDebugLog("DocLibQCB_PollQCBNewBtn", false, "ShouldEnableQCBNewButton on QCB for " + renderCtx.wpq + ". button ID: " + buttonInfo.id + ", WOPIEnabled: " + (heroParam.WOPIEnabled ? "true" : "false"));
    if (ListModule.Settings.SupportsQCB) {
        if (!renderCtx.qcbNewButtonConfigured) {
            WriteDebugLog("DocLibQCB_StartNewBtnConfig", false, "New button on QCB for " + renderCtx.wpq + " is not yet configured. Starting configuration");
            var newButtonElm = document.getElementById(buttonInfo.id);

            if (!Boolean(newButtonElm)) {
                WriteDebugLog("DocLibQCB_NewBtnElemNotFound", true, "Could not find the New button element in QCB for " + renderCtx.wpq + ". Expected ID: '" + buttonInfo.id + "'");
                return false;
            }
            if (eval("typeof DefaultNewButtonWebPart" + renderCtx.wpq + " != 'undefined'")) {
                eval("DefaultNewButtonWebPart" + renderCtx.wpq + "(newButtonElm);");
            }
            if (!heroParam.WOPIEnabled) {
                newButtonElm.setAttribute("data-viewCtr", renderCtx.ctxId);
                renderCtx.qcbNewButtonConfigured = true;
            }
            else {
                CreateNewDocumentCallout(renderCtx, newButtonElm, function() {
                    renderCtx.qcb.Poll();
                });
            }
            WriteDebugLog("DocLibQCB_NewBtnConfigSuccess", false, "Successfully configured QCB new button for " + renderCtx.wpq);
        }
        return renderCtx.qcbNewButtonConfigured;
    }
    return false;
}
function HandleQCBNewButtonPress(evt, heroParam) {
    WriteDocEngagementLog("TeamSite_DocLibQCB_HandleQCBNewBtn", "OneDrive_DocLibQCB_HandleQCBNewBtn");
    CloseAllMenusAndCallouts();
    if (ListModule.Settings.SupportsQCB) {
        if (!heroParam.WOPIEnabled) {
            _EasyUploadOrNewItem2(evt, heroParam.canEasyUpload, heroParam.addNewUrl, heroParam.wpq);
        }
    }
}
function ShouldEnableQCBUploadButton(buttonInfo, renderCtx) {
    WriteDebugLog("DocLibQCB_PollQCBUploadBtn", false, "ShouldEnableQCBUploadButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    if (ListModule.Settings.SupportsQCB) {
        return ListModule.Util.canUploadFile(renderCtx);
    }
    return false;
}
function HandleQCBUploadButtonPress(evt, uploadUrl, heroParam) {
    WriteDocEngagementLog("TeamSite_DocLibQCB_HandleQCBUploadBtn", "OneDrive_DocLibQCB_HandleQCBUploadBtn");
    CloseAllMenusAndCallouts();
    if (ListModule.Settings.SupportsQCB) {
        _EasyUploadOrNewItem2(evt, heroParam.canEasyUpload, uploadUrl, heroParam.wpq);
    }
}
function ShouldEnableQCBEditButton(buttonInfo, renderCtx) {
    WriteDebugLog("DocLibQCB_PollQCBEditBtn", false, "ShouldEnableQCBEditButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    if (ListModule.Settings.SupportsQCB) {
        if (typeof IsECBCommandEnabled == "function") {
            return IsECBCommandEnabled("EditDocument", renderCtx);
        }
    }
    return false;
}
function HandleQCBEditButtonPress(evt, renderCtx) {
    WriteDocEngagementLog("TeamSite_DocLibQCB_HandleQCBEditBtn", "OneDrive_DocLibQCB_HandleQCBEditBtn");
    CloseAllMenusAndCallouts();
    if (ListModule.Settings.SupportsQCB) {
        if (typeof ExecuteECBCommand == "function") {
            ExecuteECBCommand("EditDocument", renderCtx);
        }
    }
}
function ShouldEnableQCBEditListButton(buttonInfo, renderCtx) {
    WriteDebugLog("DocLibQCB_PollQCBEditListBtn", false, "ShouldEnableQCBEditListButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    if (ListModule.Settings.SupportsQCB) {
        return renderCtx.AllowGridMode && renderCtx.listTemplate == 100 && !renderCtx.inGridMode;
    }
    return false;
}
function HandleQCBEditListButtonPress(evt, renderCtx) {
    WriteEngagementLog("CustomListQCB_HandleQCBEditListBtn");
    CloseAllMenusAndCallouts();
    if (ListModule.Settings.SupportsQCB) {
        EnsureScriptParams('inplview', 'InitGridFromView', renderCtx.view, false);
    }
}
function ShouldEnableQCBStopEditListButton(buttonInfo, renderCtx) {
    WriteDebugLog("DocLibQCB_PollQCBStopEditListBtn", false, "ShouldEnableQCBStopEditListButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    if (ListModule.Settings.SupportsQCB) {
        return renderCtx.AllowGridMode && renderCtx.listTemplate == 100 && renderCtx.inGridMode;
    }
    return false;
}
function HandleQCBStopEditListButtonPress(evt, renderCtx) {
    WriteEngagementLog("CustomListQCB_HandleQCBStopEditListBtn");
    CloseAllMenusAndCallouts();
    if (ListModule.Settings.SupportsQCB) {
        var callback = function() {
            var curUrl = new URI(Nav.ajaxNavigate.get_href());

            curUrl.removeQueryParameter("ShowInGrid");
            window.location.replace(curUrl.getString());
        };

        ExitGrid(renderCtx.view, true, callback);
    }
}
function ShouldEnableQCBListSettingsButton(buttonInfo, renderCtx) {
    WriteDebugLog("CustomListQCB_PollQCBListSettingsBtn", false, "ShouldEnableQCBListSettingsButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    if (ListModule.Settings.SupportsQCB) {
        return renderCtx.SiteTemplateId == 64 && renderCtx.listTemplate == "100";
    }
    return false;
}
function HandleQCBListSettingsButtonPress(evt, renderCtx) {
    WriteEngagementLog("CustomListQCB_HandleQCBListSettingsBtn");
    if (ListModule.Settings.SupportsQCB) {
        Nav.navigate(_spPageContextInfo["webAbsoluteUrl"] + "/_layouts/15/" + "SimpleListSettings.aspx?List=" + renderCtx.listName + "&Source=" + URI_Encoding.encodeURIComponent(Nav.ajaxNavigate.get_href()));
    }
}
function ShouldEnableQCBManageButton(buttonInfo, renderCtx) {
    WriteDebugLog("DocLibQCB_PollQCBManageBtn", false, "ShouldEnableQCBManageButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    if (ListModule.Settings.SupportsQCB) {
        if (typeof GetListContextFromContextNumber == "undefined") {
            WriteDebugLog("DocLibQCB_PollMngBtnNoCoreJs", false, "Could not find list context since Core.js is not loaded yet");
            return false;
        }
        var qcbManageCurrentCtx = GetListContextFromContextNumber(renderCtx.ctxId);

        if (Boolean(qcbManageCurrentCtx)) {
            var logMessage = "";
            var pollingResult = false;

            if (qcbManageCurrentCtx.CurrentSelectedItems == 1) {
                logMessage = "One item selected, so we should enable the QCB manage button.";
                pollingResult = true;
                if (typeof EnsureEcbAdapterCommandsStateInitialized == "function") {
                    EnsureEcbAdapterCommandsStateInitialized(renderCtx);
                }
            }
            else if (qcbManageCurrentCtx.CurrentSelectedItems > 1) {
                if (typeof IsECBCommandEnabled == "function") {
                    pollingResult = IsECBCommandEnabled("CheckOut", renderCtx) || IsECBCommandEnabled("Delete", renderCtx) || IsECBCommandEnabled("CheckIn", renderCtx) || IsECBCommandEnabled("DiscardCheckOut", renderCtx);
                    logMessage = "Multiple items selected. Based on ECB polling, we " + (pollingResult ? "do" : "do not") + " have commands to show in the manage menu, so the button should be " + (pollingResult ? "enabled." : "disabled.");
                }
                else {
                    pollingResult = false;
                }
            }
            WriteDebugLog("DocLibQCB_PollQCBMngBtnSuccess", false, logMessage);
            return pollingResult;
        }
        else {
            WriteDebugLog("DocLibQCB_PollMngBtnNoListCtx", true, "Could not find list context for " + renderCtx.wpq + ". Expected with ctxId " + renderCtx.ctxId);
        }
    }
    return false;
}
function HandleQCBManageButtonPress(evt, renderCtx) {
    WriteDocEngagementLog("TeamSite_DocLibQCB_HandleQCBManageBtn", "OneDrive_DocLibQCB_HandleQCBManageBtn");
    if (ListModule.Settings.SupportsQCB) {
        if (typeof _handleQCBManageButtonPress == "function") {
            _handleQCBManageButtonPress(evt, renderCtx);
        }
    }
}
function ShouldEnableQCBShareButton(buttonInfo, renderCtx) {
    WriteDebugLog("DocLibQCB_PollQCBShareBtn", false, "ShouldEnableQCBShareButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    if (ListModule.Settings.SupportsQCB) {
        if (typeof ShouldEnableShareButtons == "function") {
            return ShouldEnableShareButtons(renderCtx) || Boolean(renderCtx.ListData.FolderId) && !Boolean(renderCtx.CurrentSelectedItems);
        }
    }
    return false;
}
function HandleQCBShareButtonPress(evt, renderCtx) {
    WriteDocEngagementLog("TeamSite_DocLibQCB_HandleQCBShareBtn", "OneDrive_DocLibQCB_HandleQCBShareBtn");
    CloseAllMenusAndCallouts();
    if (ListModule.Settings.SupportsCallouts) {
        if (typeof DisplaySharingDialogForListItem == "function") {
            DisplaySharingDialogForListItem(renderCtx);
        }
    }
}
function ShouldEnableQCBSyncButton(buttonInfo, heroParam, renderCtx) {
    WriteDebugLog("DocLibQCB_PollQCBSyncBtn", false, "ShouldEnableQCBSyncButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    if (ListModule.Settings.SupportsQCB) {
        return heroParam.isDocLib && (heroParam.listTemplate == 101 || heroParam.listTemplate == 700) && !renderCtx.ExcludeFromOfflineClient && (typeof navigator.msProtocols != "object" || Boolean(navigator.msProtocols["grvopen"])) && !(Flighting.VariantConfiguration.IsExpFeatureClientEnabled(478) && window["groupContextData"] != null);
    }
    return false;
}
var g_syncButtonUsePopup;

function HandleQCBSyncButtonPress(evt, renderCtx, fromExplorer) {
    WriteDocEngagementLog("TeamSite_DocLibQCB_HandleQCBSyncBtn", "OneDrive_DocLibQCB_HandleQCBSyncBtn");
    CloseAllMenusAndCallouts();
    if (ListModule.Settings.SupportsQCB) {
        if (typeof _handleQCBSyncButtonPress == "function") {
            _handleQCBSyncButtonPress(evt, renderCtx, fromExplorer);
        }
    }
}
function ShouldEnableQCBAddToOneDriveButton(buttonInfo, heroParam, renderCtx) {
    WriteDebugLog("DocLibQCB_PollQCBAddToOneDriveBtn", false, "ShouldEnableQCBAddToOneDriveButton on QCB for " + renderCtx.wpq + ", button ID: " + buttonInfo.id);
    return ListModule.Settings.SupportsAddToOneDrive && ListModule.Settings.SupportsAddToOneDriveQCB && heroParam.isDocLib && (heroParam.listTemplate == 101 || heroParam.listTemplate == 700) && !renderCtx.ExcludeFromOfflineClient && (typeof navigator.msProtocols != "object" || Boolean(navigator.msProtocols["grvopen"]));
}
function HandleQCBAddToOneDriveButtonPress(evt, renderCtx, fromExplorer) {
    WriteEngagementLog("DocLibQCB_HandleQCBAddToOneDriveBtn");
    CloseAllMenusAndCallouts();
    if (ListModule.Settings.SupportsAddToOneDrive && ListModule.Settings.SupportsAddToOneDriveQCB) {
        if (typeof _handleQCBAddToOneDriveButtonPress == "function") {
            _handleQCBAddToOneDriveButtonPress(evt, renderCtx, fromExplorer);
        }
    }
}
function RenderHeroAddNewLink(heroParam, renderCtx) {
    var ret = [];

    ret.push('<a id="');
    ret.push(heroParam.heroId);
    if (ListModule.Settings.SupportsDoclibAccessibility)
        ret.push('" class="ms-heroCommandLink ms-hero-command-enabled-alt"');
    else
        ret.push('" class="ms-heroCommandLink"');
    ret.push(' href="');
    ret.push(heroParam.addNewUrl);
    ret.push('"');
    if (!heroParam.WOPIEnabled) {
        ret.push(' data-viewCtr="');
        ret.push(renderCtx.ctxId);
        ret.push("\" onclick=\"_EasyUploadOrNewItem2(event, ");
        ret.push(heroParam.canEasyUpload);
        ret.push(", &quot;");
        ret.push(heroParam.addNewUrl);
        ret.push("&quot;, &quot;");
        ret.push(renderCtx.wpq);
        ret.push("&quot;); return false;\" target=\"_self\"");
    }
    ret.push(" title=\"");
    ret.push(window["ListView"]["Strings"]["L_SPAddNewItemTitle"]);
    ret.push("\">");
    if (heroParam.largeSize) {
        ret.push("<span class=\"ms-list-addnew-imgSpan20\">");
    }
    else {
        ret.push("<span class=\"ms-list-addnew-imgSpan16\">");
    }
    ret.push('<img id="');
    ret.push(heroParam.heroId + '-img');
    ret.push('" src="');
    ret.push(GetThemedImageUrl("spcommon.png"));
    if (heroParam.largeSize) {
        ret.push('" class="ms-list-addnew-img20"/>');
    }
    else {
        ret.push('" class="ms-list-addnew-img16"/>');
    }
    ret.push("</span><span>");
    ret.push(heroParam.addNewText);
    ret.push("</span></a>");
    if (heroParam.WOPIEnabled) {
        AddPostRenderCallback(renderCtx, CreateNewDocumentCallout);
    }
    return ret.join('');
}
function ShouldRenderHeroButton(renderCtx) {
    var listSchema = renderCtx.ListSchema;

    return !Boolean(renderCtx.DisableHeroButton) && (!listSchema.IsDocLib || (ListModule.Util.canUploadFile(renderCtx) || renderCtx.ListTemplateType == 119 || Boolean(renderCtx.NewWOPIDocumentEnabled))) && listSchema.FolderRight_AddListItems != null && (listSchema.Toolbar == 'Freeform' || typeof window['heroButtonWebPart' + renderCtx.wpq] != 'undefined' && listSchema.Toolbar == 'Standard') && !PageMinimized();
}
function CanEasyUploadFile(renderCtx) {
    if (ListModule.Settings.SupportsDragDrop) {
        return IsEasyUploadEnabled(renderCtx);
    }
    return false;
}
function _EasyUploadOrNewItem2(evt, canEasyUpload, url, wpq) {
    CoreInvoke("EasyUploadOrNewItem2", evt, canEasyUpload, url, wpq);
}
function CanDragUploadFile(renderCtx) {
    if (ListModule.Settings.SupportsDragDrop) {
        return _canDragUploadFile(renderCtx) && !IsInFilePickerMode(renderCtx);
    }
    return false;
}
function ShouldShowDragDropAttractBox(renderCtx) {
    if (ListModule.Settings.SupportsDragDrop) {
        var canBrowserDragUpload = typeof FormData != "undefined" && !(BrowserDetection.userAgent.ipad || BrowserDetection.userAgent.windowsphone) && renderCtx.canDragUpload;
        var isDocLib = Boolean(renderCtx.ListSchema) && renderCtx.ListSchema.IsDocLib;
        var compatibleFileState = (!Boolean(renderCtx.ListData.LastRow) || renderCtx.ListData.LastRow < 5) && !ListModule.Util.isDefinedAndNotNullOrEmpty(renderCtx.rootFolder) || Flighting.VariantConfiguration.IsExpFeatureClientEnabled(178);
        var hasPermissions = ShouldRenderHeroButton(renderCtx);

        return canBrowserDragUpload && isDocLib && compatibleFileState && hasPermissions;
    }
    else {
        return false;
    }
}
function ReRenderHeroButton(renderCtx) {
    if (!Flighting.VariantConfiguration.IsExpFeatureClientEnabled(497))
        return;
    var parentNode = document.getElementById('script' + renderCtx.wpq);

    if (parentNode == null)
        return;
    var permission = renderCtx.ListData.FolderPermissions;

    if (permission === undefined)
        return;
    renderCtx.ListSchema.FolderRight_AddListItems = (Number('0x' + permission.substring(permission.length - 1)) & 0x2) == 0x2 ? true : null;
    var heroElement = document.getElementById("Hero-" + renderCtx.wpq);
    var shouldRenderHeroButton = ShouldRenderHeroButton(renderCtx);

    if (shouldRenderHeroButton && heroElement == null) {
        var ret = [];

        RenderHeroButton(ret, renderCtx);
        var newDiv = document.createElement('div');

        newDiv = parentNode.insertBefore(newDiv, parentNode.firstChild);
        newDiv.innerHTML = ret.join('');
        RenderDocumentLibraryQCB(renderCtx);
    }
    else if (!shouldRenderHeroButton && heroElement != null) {
        heroElement.parentNode.removeChild(heroElement);
    }
}
function RenderHeroButton(ret, renderCtx) {
    function NewButtonRedirection() {
        var WPQ = renderCtx.wpq;

        if (eval("typeof DefaultNewButtonWebPart" + WPQ + " != 'undefined'")) {
            if (Boolean(renderCtx.heroId)) {
                var eleLink = document.getElementById(renderCtx.heroId);

                if (eleLink != null)
                    eval("DefaultNewButtonWebPart" + WPQ + "(eleLink);");
            }
        }
    }
    var listSchema = renderCtx.ListSchema;
    var wpq = renderCtx.wpq;

    if (!ShouldRenderHeroButton(renderCtx)) {
        return;
    }
    ret.push('<table id="Hero-');
    ret.push(wpq);
    ret.push('" dir="');
    ret.push(listSchema.Direction);
    ret.push('" cellpadding="0" cellspacing="0" border="0"');
    if (listSchema.IsDocLib && !renderCtx.inGridMode && ListModule.Settings.SupportsDoclibQCB)
        ret.push(' class="ms-fullWidth"');
    ret.push('>');
    ret.push('<tr><td class="ms-list-addnew ');
    if (listSchema.InplaceSearchEnabled) {
        if (!(listSchema.IsDocLib && !renderCtx.inGridMode && ListModule.Settings.SupportsDoclibQCB))
            ret.push('ms-textXLarge ');
        ret.push('ms-list-addnew-aligntop');
    }
    else {
        ret.push('ms-textLarge');
    }
    ret.push(' ms-soften">');
    ret.push(RenderHeroLink(renderCtx, false));
    ret.push('</td></tr>');
    ret.push('</table>');
    if (renderCtx.ListTemplateType == 115) {
        AddPostRenderCallback(renderCtx, function() {
            setTimeout(NewButtonRedirection, 0);
        });
    }
}
function CreateNewDocumentCallout(rCtx, launchPointOverride, qcbPollCallback) {
    if (ListModule.Settings.SupportsCallouts) {
        _createNewDocumentCallout(rCtx, ListModule.Settings.SupportsDoclibQCB, launchPointOverride, qcbPollCallback);
    }
}
function RenderTitle(titleText, renderCtx, listItem, listSchema, title, isLinkToItem) {
    titleText.push("<a class=\"ms-listlink\" onfocus=\"OnLink(this)\" href=\"");
    titleText.push(ListModule.Util.createItemPropertiesTitleUrl(renderCtx, listItem));
    titleText.push("\" onclick=\"");
    AddUIInstrumentationClickEvent(titleText, listItem, 'Navigation');
    titleText.push("EditLink2(this,");
    titleText.push(renderCtx.ctxId);
    titleText.push(");return false;\" target=\"_self\">");
    titleText.push(Boolean(listSchema.HasTitle) || Boolean(isLinkToItem) ? title : Encoding.HtmlEncode(title));
    titleText.push("</a>");
}
function ariaLabelForFolder(fileMapApp, leafType) {
    if (fileMapApp != null && (fileMapApp.toLowerCase()).indexOf("onenote") != -1)
        return leafType ? window["ListView"]["Strings"]["L_FieldType_File_OneNote"] : window["ListView"]["Strings"]["L_FieldType_Folder_OneNote"];
    else
        return window["ListView"]["Strings"]["L_FieldType_Folder"];
}
function ariaLabelForFile(fileMapApp, fileType) {
    var ariaFileType = window["ListView"]["Strings"]["L_FieldType_File"];

    if (fileMapApp != null && fileMapApp != "") {
        if ((fileMapApp.toLowerCase()).indexOf("ms-word") != -1)
            ariaFileType = window["ListView"]["Strings"]["L_FieldType_File_Document"];
        else if ((fileMapApp.toLowerCase()).indexOf("ms-excel") != -1)
            ariaFileType = window["ListView"]["Strings"]["L_FieldType_File_workbook"];
        else if ((fileMapApp.toLowerCase()).indexOf("ms-powerpoint") != -1)
            ariaFileType = window["ListView"]["Strings"]["L_FieldType_File_PPT"];
        else if ((fileMapApp.toLowerCase()).indexOf("onenote") != -1)
            ariaFileType = window["ListView"]["Strings"]["L_FieldType_File_OneNote"];
    }
    else if (fileType != null && fileType != "") {
        ariaFileType = fileType + " " + window["ListView"]["Strings"]["L_FieldType_File"];
    }
    return ariaFileType;
}
function LinkTitleValue(titleValue) {
    if (titleValue == '')
        return window["ListView"]["Strings"]["L_SPClientNoTitle"];
    else
        return titleValue;
}
function ComputedFieldRenderer_InitializePrototype() {
    ComputedFieldRenderer.prototype = {
        fieldRenderer: null,
        fldName: null,
        RenderField: ComputedFieldRenderField
    };
}
function ComputedFieldRenderer(fieldName) {
    this.fldName = fieldName;
    this.fieldRenderer = null;
}
function ComputedFieldRenderField(renderCtx, field, listItem, listSchema) {
    if (this.fieldRenderer == null)
        this.fieldRenderer = ComputedFieldWorker[this.fldName];
    if (this.fieldRenderer != null)
        return this.fieldRenderer(renderCtx, field, listItem, listSchema);
    else
        return Encoding.HtmlEncode(listItem[this.fldName]);
}
var RenderCalloutAffordance;
var RenderECB;
var RenderCalloutMenu;

function isPositiveInteger(s) {
    var pattern = /^[1-9][0-9]*$/;

    return pattern.test(s);
}
function createOneTimeCallback(fn) {
    return (function() {
        var hasLoadedOnce = false;

        return function() {
            if (hasLoadedOnce)
                return;
            hasLoadedOnce = true;
            return fn.apply(this, arguments);
        };
    })();
}
function EnableSharingDialogIfNeeded(renderCtx) {
    if (ListModule.Settings.SupportsSharingDialog) {
        var loadSharingDialogIfNecessary = createOneTimeCallback(function(renderContext) {
            var uri = new URI(Nav.ajaxNavigate.get_href());
            var sharingDialogForListItemId = uri.getQueryParameter("sharingDialogForListItemId");

            if (Boolean(sharingDialogForListItemId)) {
                if (isPositiveInteger(sharingDialogForListItemId)) {
                    var tabId = uri.getQueryParameter("tts");

                    if (Boolean(tabId)) {
                        DisplaySharingDialogForListItem(renderContext, sharingDialogForListItemId, Number(tabId));
                    }
                    else {
                        DisplaySharingDialogForListItem(renderContext, sharingDialogForListItemId);
                    }
                }
                else {
                    ;
                }
            }
        });

        AddPostRenderCallback(renderCtx, loadSharingDialogIfNecessary);
    }
}
function DisplayExplorerWindowIfNeeded(renderCtx) {
    var loadExplorerWindowIfNecessary = createOneTimeCallback(function(renderContext) {
        var uri = new URI(Nav.ajaxNavigate.get_href());
        var destinationUrl = uri.getQueryParameter("ExplorerWindowUrl");

        if (Boolean(destinationUrl)) {
            CoreInvoke('NavigateHttpFolder', destinationUrl, '_blank');
        }
    });

    AddPostRenderCallback(renderCtx, loadExplorerWindowIfNecessary);
}
function EnablePolicyTipDialogIfNeeded(renderCtx) {
    if (ListModule.Settings.SupportsPolicyTips && renderCtx.bInitialRender) {
        var loadPolicyTipDialogIfNecessary = createOneTimeCallback(function(renderContext) {
            var uri = new URI(Nav.ajaxNavigate.get_href());
            var listItemId = uri.getQueryParameter("policyTipForListItemId");

            if (Boolean(listItemId)) {
                if (isPositiveInteger(listItemId)) {
                    EnsureScriptFunc("core.js", "CalloutPostRenderPolicyTip", function() {
                        CalloutPostRenderPolicyTip(renderContext, listItemId);
                    });
                }
                else {
                    ;
                }
            }
        });

        AddPostRenderCallback(renderCtx, loadPolicyTipDialogIfNecessary);
    }
}
function EnsureFileLeafRefName(listItem) {
    if (typeof listItem["FileLeafRef.Name"] == 'undefined') {
        var fileLeafRef = listItem["FileLeafRef"];
        var suffixIndex = fileLeafRef.lastIndexOf('.');

        if (suffixIndex >= 0)
            listItem["FileLeafRef.Name"] = fileLeafRef.substring(0, suffixIndex);
        else
            listItem["FileLeafRef.Name"] = fileLeafRef;
    }
}
function EnsureFileLeafRefSuffix(listItem) {
    if (typeof listItem["FileLeafRef.Suffix"] == 'undefined') {
        var fileLeafRef = listItem["FileLeafRef"];
        var suffixIndex = fileLeafRef.lastIndexOf('.');

        if (suffixIndex >= 0)
            listItem["FileLeafRef.Suffix"] = fileLeafRef.substring(suffixIndex + 1);
        else
            listItem["FileLeafRef.Suffix"] = '';
    }
}
function EnsureFileDirRef(listItem) {
    if (typeof listItem["FileDirRef"] == 'undefined') {
        var fileRef = listItem["FileRef"];

        if (Boolean(fileRef)) {
            var prefixIndex = fileRef.indexOf('/');
            var suffixIndex = fileRef.lastIndexOf('/');

            if (suffixIndex >= 0)
                listItem["FileDirRef"] = fileRef.substring(prefixIndex, suffixIndex - prefixIndex);
            else
                listItem["FileDirRef"] = '';
        }
    }
}
var getDocumentIconAbsoluteUrl;
var displayGenericDocumentIcon;

function EncodeUrl(str) {
    if (typeof str != 'undefined' && str != null)
        return str.replace(/"/g, '%22');
    else
        return "";
}
function RenderUrl(listItem, fldName, listSchema, field, onfocusParam) {
    var ret = [];
    var url = listItem[fldName];
    var dest = listItem[fldName + ".desc"];

    if (field.Format == 'Image') {
        if (ListModule.Util.isDefinedAndNotNullOrEmpty(url)) {
            ret.push("<img ");
            if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(494)) {
                ret.push(" class='ms-listview-image' ");
                ret.push(" onclick='javascript:var imgUrl=\"");
                ret.push(EncodeUrl(url));
                ret.push("\"; if (_shouldOpenInLightbox(imgUrl)){_openInLightbox(imgUrl);} else{STSNavigate(imgUrl);}'");
            }
            if (onfocusParam)
                ret.push("onfocus=\"OnLink(this)\" ");
            ret.push("src=\"");
            ret.push(EncodeUrl(url));
            ret.push("\" alt=\"");
            ret.push(dest);
            ret.push("\"/>");
        }
    }
    else if (field.Format == 'Hyperlink') {
        if (!ListModule.Util.isDefinedAndNotNullOrEmpty(url)) {
            if (dest != null)
                ret.push(dest);
        }
        else {
            ret.push("<a ");
            if (onfocusParam)
                ret.push("onfocus=\"OnLink(this)\" ");
            ret.push("href=\"");
            ret.push(EncodeUrl(url));
            var isDlg = typeof Nav.ajaxNavigate == "undefined" ? window.location.search.match(RegExp("[?&]IsDlg=1")) : (Nav.ajaxNavigate.get_search()).match(RegExp("[?&]IsDlg=1"));

            if (Boolean(isDlg)) {
                ret.push("\" target=\"_blank");
            }
            ret.push("\">");
            if (dest == '')
                ret.push(Encoding.HtmlEncode(url));
            else
                ret.push(Encoding.HtmlEncode(dest));
            ret.push("</a>");
        }
    }
    return ret.join('');
}
function ResolveId(listItem, listSchema) {
    if (listItem.EventType == '4')
        return listItem.ID + ".1." + listItem.MasterSeriesItemID;
    else
        return listItem.ID;
}
function EditRequiresCheckout(listItem, listSchema) {
    var bNotCheckedOut = typeof listItem["CheckoutUser"] == 'undefined' || listItem["CheckoutUser"] == '';

    if (!Flighting.VariantConfiguration.IsExpFeatureClientEnabled(499)) {
        bNotCheckedOut = !bNotCheckedOut;
    }
    if (listSchema.ForceCheckout == '1' && listItem.FSObjType != '1' && bNotCheckedOut)
        return '1';
    else
        return '';
}
function fMaintainUserChrome() {
    var maintain = false;
    var uri = new URI(Nav.ajaxNavigate.get_href());
    var maintainUserChrome = uri.getQueryParameter("MaintainUserChrome");

    maintain = ListModule.Settings.SupportsMaintainUserChrome && Boolean(maintainUserChrome) && maintainUserChrome.toLowerCase() == "true";
    return maintain;
}
function UpdateAdditionalQueryString(listItem, queryParameter, newValue) {
    var additionalQueryString = listItem["AdditionalQueryString"];

    if (typeof additionalQueryString == 'undefined' || additionalQueryString == '') {
        listItem["AdditionalQueryString"] = "&" + queryParameter + "=" + newValue;
        return;
    }
    else {
        var uri = new URI(listItem["FileRef"] + "?" + additionalQueryString);

        uri.setQueryParameter(queryParameter, newValue);
        listItem["AdditionalQueryString"] = "&" + uri.getQuery();
    }
}
function AppendAdditionalQueryStringToFolderUrl(listItem, ret) {
    var additionalQueryString = listItem["AdditionalQueryString"];

    if (typeof additionalQueryString == 'undefined' || additionalQueryString == '')
        return;
    ret.push(additionalQueryString);
}
function FolderUrl(listItem, listSchema, ret) {
    ret.push(listSchema.PagePath);
    ret.push("?RootFolder=");
    ret.push(URI_Encoding.encodeURIComponent(listItem.FileRef));
    ret.push(listSchema.ShowWebPart);
    ret.push("&FolderCTID=");
    ret.push(listItem.ContentTypeId);
    ret.push("&View=");
    ret.push(URI_Encoding.encodeURIComponent(listSchema.View));
    AppendAdditionalQueryStringToFolderUrl(listItem, ret);
}
function RenderListFolderLink(ret, content, listItem, listSchema) {
    ret.push("<a onfocus=\"OnLink(this)\" href=\"");
    FolderUrl(listItem, listSchema, ret);
    ret.push("\" onclick=\"");
    AddUIInstrumentationClickEvent(ret, listItem, 'Navigation');
    ret.push("javascript:EnterFolder('");
    ret.push(listSchema.PagePath);
    ret.push("?RootFolder=");
    ret.push(URI_Encoding.encodeURIComponent(listItem.FileRef));
    ret.push(listSchema.ShowWebPart);
    ret.push("&FolderCTID=");
    ret.push(listItem.ContentTypeId);
    ret.push("&View=");
    ret.push(URI_Encoding.encodeURIComponent(listSchema.View));
    AppendAdditionalQueryStringToFolderUrl(listItem, ret);
    if (ListModule.Settings.SupportsDoclibAccessibility) {
        ret.push("');return false;\" aria-label=\"");
        ret.push(Encoding.HtmlEncode(content));
        ret.push(", " + Encoding.HtmlEncode(ariaLabelForFolder(listItem["File_x0020_Type.mapapp"], true)) + "\">");
    }
    else {
        ret.push("');return false;\">");
    }
    ret.push(Encoding.HtmlEncode(content));
    ret.push("</a>");
}
function RenderDocFolderLink(renderCtx, ret, content, listItem, listSchema) {
    if (fMaintainUserChrome())
        UpdateAdditionalQueryString(listItem, "MaintainUserChrome", "true");
    ret.push("<a onfocus=\"OnLink(this)\" class=\"ms-listlink\" href=\"");
    FolderUrl(listItem, listSchema, ret);
    ret.push("\" onmousedown=\"");
    ret.push("javascript:VerifyFolderHref(this,event,'");
    ret.push(listItem["File_x0020_Type.url"]);
    ret.push("','");
    ret.push(listItem["File_x0020_Type.progid"]);
    ret.push("','");
    ret.push(listSchema.DefaultItemOpen);
    ret.push("','");
    ret.push(listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapcon"]);
    ret.push("','");
    ret.push(listItem["HTML_x0020_File_x0020_Type"]);
    ret.push("','");
    if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(90)) {
        ret.push(Encoding.ScriptEncode(listItem["serverurl.progid"]));
    }
    else {
        ret.push(listItem["serverurl.progid"]);
    }
    ret.push("');");
    if (!Flighting.VariantConfiguration.IsExpFeatureClientEnabled(226)) {
        ret.push("return false;");
    }
    ret.push("\" onclick=\"");
    AddUIInstrumentationClickEvent(ret, listItem, 'Navigation');
    ret.push("return HandleFolder(this,event,'");
    ret.push(listSchema.PagePath);
    ret.push("?RootFolder=");
    ret.push(URI_Encoding.encodeURIComponent(listItem.FileRef));
    ret.push(listSchema.ShowWebPart);
    ret.push("&FolderCTID=");
    ret.push(listItem.ContentTypeId);
    ret.push("&View=");
    ret.push(URI_Encoding.encodeURIComponent(listSchema.View));
    AppendAdditionalQueryStringToFolderUrl(listItem, ret);
    var mpQueryStrParams = ListModule.Util.makeMountedFolderQueryStrParams(true, true);

    if (Boolean(mpQueryStrParams)) {
        ret.push(mpQueryStrParams);
    }
    ret.push("','TRUE','FALSE','");
    ret.push(listItem["File_x0020_Type.url"]);
    ret.push("','");
    ret.push(listItem["File_x0020_Type.progid"]);
    ret.push("','");
    ret.push(listSchema.DefaultItemOpen);
    ret.push("','");
    ret.push(listItem["HTML_x0020_File_x0020_Type.File_x0020_Type.mapcon"]);
    ret.push("','");
    ret.push(listItem["HTML_x0020_File_x0020_Type"]);
    ret.push("','");
    if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(90)) {
        ret.push(Encoding.ScriptEncode(listItem["serverurl.progid"]));
    }
    else {
        ret.push(listItem["serverurl.progid"]);
    }
    ret.push("','");
    ret.push(Boolean(listItem["CheckoutUser"]) ? listItem["CheckoutUser"][0].id : '');
    ret.push("','");
    ret.push(listSchema.Userid);
    ret.push("','");
    ret.push(listSchema.ForceCheckout);
    ret.push("','");
    ret.push(listItem.IsCheckedoutToLocal);
    ret.push("','");
    ret.push(listItem.PermMask);
    if (ListModule.Settings.SupportsDoclibAccessibility) {
        ret.push("');\" aria-label=\"");
        ret.push(Encoding.HtmlEncode(content));
        ret.push(", " + Encoding.HtmlEncode(ariaLabelForFolder(listItem["File_x0020_Type.mapapp"], true)) + "\">");
    }
    else {
        ret.push("');\">");
    }
    ret.push(Encoding.HtmlEncode(content));
    ret.push("</a>");
}
function FieldRenderer_InitializePrototype() {
    FieldRenderer.prototype = {
        fldName: null,
        RenderField: FieldRendererRenderField
    };
}
function FieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function FieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    return Encoding.HtmlEncode(listItem[this.fldName]);
}
function RawFieldRenderer_InitializePrototype() {
    RawFieldRenderer.prototype = {
        fldName: null,
        RenderField: RawFieldRendererRenderField
    };
}
function RawFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function RawFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    return listItem[this.fldName];
}
function AttachmentFieldRenderer_InitializePrototype() {
    AttachmentFieldRenderer.prototype = {
        fldName: null,
        RenderField: AttachmentFieldRendererRenderField
    };
}
function AttachmentFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function AttachmentFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    var value = listItem[this.fldName];

    if (value != '0')
        return "<img border=\"0\" width=\"16\" height=\"16\" src=\"" + GetThemedImageUrl("attach16.png") + "\"/>";
    else
        return "";
}
function RecurrenceFieldRenderer_InitializePrototype() {
    RecurrenceFieldRenderer.prototype = {
        fldName: null,
        RenderField: RecurrenceFieldRendererRenderField
    };
}
function RecurrenceFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function RecurrenceFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    var value = listItem[this.fldName];
    var ret = '<img border="0" width="16" height="16" src="';

    ret += ListView.ImageBasePath;
    ret += "/_layouts/15/images/";
    if (value == '1') {
        var eventType = listItem.EventType;

        if (eventType == '3' || eventType == '4')
            ret += 'recurEx.gif';
        else
            ret += 'recur.gif';
    }
    else
        ret += 'blank.gif';
    ret += '" alt="';
    ret += window["ListView"]["Strings"]["L_SPMeetingWorkSpace"];
    ret += '" title="';
    ret += window["ListView"]["Strings"]["L_SPMeetingWorkSpace"];
    ret += '"/>';
    return ret;
}
function ProjectLinkFieldRenderer_InitializePrototype() {
    ProjectLinkFieldRenderer.prototype = {
        fldName: null,
        RenderField: ProjectLinkFieldRendererRenderField
    };
}
function ProjectLinkFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function ProjectLinkFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    if (!(listItem.WorkspaceLink == '1' || listItem.WorkspaceLink == '-1')) {
        return '<img border="0" width="16" height="16" src="' + ListView.ImageBasePath + '/_layouts/15/images/blank.gif' + '" />';
    }
    else {
        var ret = '<a href="';

        ret += listItem.Workspace;
        ret += '" target="_self" title="';
        ret += window["ListView"]["Strings"]["L_SPMeetingWorkSpace"];
        ret += '"><img border="" src="' + GetThemedImageUrl("mtgicon.gif") + '" alt="';
        ret += window["ListView"]["Strings"]["L_SPMeetingWorkSpace"];
        ret += '"/></a>';
        return ret;
    }
}
function AllDayEventFieldRenderer_InitializePrototype() {
    AllDayEventFieldRenderer.prototype = {
        fldName: null,
        RenderField: AllDayEventFieldRendererRenderField
    };
}
function AllDayEventFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function AllDayEventFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    if (listItem[this.fldName] == window["ListView"]["Strings"]["L_SPYes"])
        return window["ListView"]["Strings"]["L_SPYes"];
    else
        return '';
}
function NumberFieldRenderer_InitializePrototype() {
    NumberFieldRenderer.prototype = {
        fldName: null,
        RenderField: NumberFieldRendererRenderField
    };
}
function NumberFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function NumberFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    return '<div align="right" class="ms-number">' + listItem[this.fldName] + '</div>';
}
function BusinessDataFieldRenderer_InitializePrototype() {
    BusinessDataFieldRenderer.prototype = {
        fldName: null,
        RenderField: BusinessDataFieldRendererRenderField
    };
}
function BusinessDataFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function BusinessDataFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    var fieldDefinition = renderCtx['CurrentFieldSchema'];
    var fieldValue = listItem[this.fldName];

    if (fieldValue == '') {
        fieldValue = window["ListView"]["Strings"]["L_BusinessDataField_Blank"];
    }
    var ret = '<table cellpadding="0" cellspacing="0" style="display=inline">';

    ret += '<tr>';
    if (Boolean(fieldDefinition.HasActions)) {
        ret += '<td><input type="hidden" name="BusinessDataField_ActionsMenuProxyPageWebUrl" id="BusinessDataField_ActionsMenuProxyPageWebUrl" value="' + renderCtx.HttpRoot + '" />';
        ret += '<div style="display=inline">';
        ret += '<table cellspacing="0">';
        ret += '<tr>';
        ret += '<td class="ms-vb" valign="top" nowrap="nowrap">';
        ret += '<span class="ms-SPLink ms-hovercellinactive" onmouseover="this.className=\'ms-SPLink ms-HoverCellActive\';" onmouseout="this.className=\'ms-SPLink ms-HoverCellInactive\';">';
        var onclickMethod = '';
        var onKeyDownMethod = '';
        var methodParameters = '';

        if (Boolean(renderCtx.ExternalDataList)) {
            methodParameters = '\'' + window["ListView"]["Strings"]["L_BusinessDataField_ActionMenuLoadingMessage"] + '\',null,true,\'' + renderCtx.LobSystemInstanceName + '\',\'' + renderCtx.EntityNamespace + '\',\'' + renderCtx.EntityName + '\',\'' + renderCtx.SpecificFinderName + '\',\'' + fieldDefinition.AssociationName + '\',\'' + fieldDefinition.SystemInstanceName + '\',\'' + fieldDefinition.EntityNamespace + '\',\'' + fieldDefinition.EntityName + '\',\'' + listItem.ID + '\', event';
            onclickMethod = 'showActionMenuInExternalList(' + methodParameters + ')';
            onKeyDownMethod = 'actionMenuOnKeyDownInExternalList(' + methodParameters + ')';
        }
        else {
            if (typeof field.RelatedField != 'undefined' && field.RelatedField != '' && typeof listItem[field.RelatedField] != 'undefined' && listItem[field.RelatedField] != '') {
                methodParameters = '\'' + window["ListView"]["Strings"]["L_BusinessDataField_ActionMenuLoadingMessage"] + '\',null,true,\'' + fieldDefinition.SystemInstanceName + '\',\'' + fieldDefinition.EntityNamespace + '\',\'' + fieldDefinition.EntityName + '\',\'' + listItem[field.RelatedField] + '\', event';
                onclickMethod = 'showActionMenu(' + methodParameters + ')';
                onKeyDownMethod = 'actionMenuOnKeyDown(' + methodParameters + ')';
            }
        }
        ret += '<a style="cursor:hand;white-space:nowrap;">';
        ret += '<img border="0" align="absmiddle" src=' + ListView.ImageBasePath + "/_layouts/15/images/bizdataactionicon.gif?rev=44" + ' tabindex="0" alt="' + window["ListView"]["Strings"]["L_BusinessDataField_ActionMenuAltText"] + '" title="' + window["ListView"]["Strings"]["L_BusinessDataField_ActionMenuAltText"] + '"';
        ret += ' onclick="' + onclickMethod + '"';
        ret += ' onkeydown="' + onKeyDownMethod + '" />';
        ret += '</a>';
        ret += '<a>';
        ret += '<img align="absmiddle" src=' + ListView.ImageBasePath + "/_layouts/15/images/menudark.gif?rev=44" + ' tabindex="0" alt="' + window["ListView"]["Strings"]["L_BusinessDataField_ActionMenuAltText"] + '"';
        ret += ' onclick="' + onclickMethod + '"';
        ret += ' onkeydown="' + onKeyDownMethod + '" />';
        ret += '</a>';
        ret += '</span>';
        ret += '</td>';
        ret += '</tr>';
        ret += '</table>';
        ret += '</div>';
        ret += '<div STYLE="display=inline" />';
        ret += '</td>';
    }
    ret += '<td class="ms-vb">';
    if (fieldDefinition.Profile != '' && fieldDefinition.ContainsDefaultAction == 'True') {
        ret += '<a href="' + renderCtx.HttpRoot + fieldDefinition.Profile + listItem[field.RelatedField] + '" >' + fieldValue + '</a>';
    }
    else {
        ret += fieldValue;
    }
    ret += '</td>';
    ret += '</tr>';
    ret += '</table>';
    return ret;
}
function DateTimeFieldRenderer_InitializePrototype() {
    DateTimeFieldRenderer.prototype = {
        fldName: null,
        RenderField: DateTimeFieldRendererRenderField
    };
}
function DateTimeFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function DateTimeFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    var absoluteDateTimeString = listItem[this.fldName];

    if (absoluteDateTimeString == null) {
        return "";
    }
    var friendlyDisplayText = listItem[this.fldName + ".FriendlyDisplay"];
    var relativeDateTimeString = null;

    if (friendlyDisplayText != null && friendlyDisplayText != "") {
        relativeDateTimeString = GetRelativeDateTimeString(friendlyDisplayText);
    }
    var ret = '<span class="ms-noWrap" title="' + absoluteDateTimeString + '">';

    ret += relativeDateTimeString != null && relativeDateTimeString != "" ? relativeDateTimeString : absoluteDateTimeString;
    ret += '</span>';
    return ret;
}
function TextFieldRenderer_InitializePrototype() {
    TextFieldRenderer.prototype = {
        fldName: null,
        RenderField: TextFieldRendererRenderField
    };
}
function TextFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function TextFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    if (field.AutoHyperLink != null)
        return listItem[this.fldName];
    else
        return Encoding.HtmlEncode(listItem[this.fldName]);
}
function LookupFieldRenderer_InitializePrototype() {
    LookupFieldRenderer.prototype = {
        fldName: null,
        RenderField: LookupFieldRendererRenderField
    };
}
function LookupFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function LookupFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    function GetFieldValueAsText(value) {
        if (!Boolean(value))
            return '';
        ret = [];
        for (i = 0; i < value.length; i++) {
            if (i > 0)
                ret.push("; ");
            ret.push(Encoding.HtmlEncode(value[i].lookupValue));
        }
        return ret.join('');
    }
    var fieldValue = listItem[this.fldName];

    if (!Boolean(fieldValue))
        return '';
    if (typeof fieldValue == "string")
        return Encoding.HtmlEncode(fieldValue);
    if (field.RenderAsText != null)
        return GetFieldValueAsText(fieldValue);
    if (!Boolean(field.DispFormUrl))
        return '';
    var ret = [];

    for (var i = 0; i < fieldValue.length; i++) {
        if (i > 0)
            ret.push("; ");
        var sbUrl = [];

        sbUrl.push(field.DispFormUrl);
        sbUrl.push("&ID=");
        sbUrl.push(fieldValue[i].lookupId.toString());
        sbUrl.push("&RootFolder=*");
        var url = sbUrl.join('');

        ret.push("<a ");
        ret.push("onclick=\"OpenPopUpPage('");
        ret.push(url);
        ret.push("', RefreshPage); return false;\" ");
        ret.push("href=\"");
        ret.push(url);
        ret.push("\">");
        ret.push(Encoding.HtmlEncode(fieldValue[i].lookupValue));
        ret.push("</a>");
    }
    return ret.join('');
}
function NoteFieldRenderer_InitializePrototype() {
    NoteFieldRenderer.prototype = {
        fldName: null,
        RenderField: NoteFieldRendererRenderField
    };
}
function NoteFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function NoteFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    var ret = [];

    ret.push("<div dir=\"");
    ret.push(field.Direction);
    ret.push("\" class=\"ms-rtestate-field\">");
    ret.push(listItem[this.fldName]);
    ret.push("</div>");
    return ret.join('');
}
function UrlFieldRenderer_InitializePrototype() {
    UrlFieldRenderer.prototype = {
        fldName: null,
        RenderField: UrlFieldRendererRenderField
    };
}
function UrlFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function UrlFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    return RenderUrl(listItem, this.fldName, listSchema, field, false);
}
function UserFieldRenderer_InitializePrototype() {
    UserFieldRenderer.prototype = {
        fldName: null,
        RenderField: UserFieldRendererRenderField
    };
}
function UserFieldRenderer(fieldName) {
    this.fldName = fieldName;
}
function SetFieldClickInstrumentationData(userField, listItem) {
    if (typeof listItem.piCD != "undefined" && listItem.piCD != "") {
        if (typeof userField.piCD == "undefined") {
            userField.piCD = listItem.piCD;
        }
    }
    if (typeof listItem.piPC != "undefined" && listItem.piPC != "") {
        if (typeof userField.piPC == "undefined") {
            userField.piPC = listItem.piPC;
        }
    }
}
var s_ImnId;

function UserFieldRendererRenderField(renderCtx, field, listItem, listSchema) {
    var userField = listItem[this.fldName];

    if (typeof userField == "string" && (userField == '' || userField == "***")) {
        return userField;
    }
    var ret = [];
    var defaultMultiUserRender = field.DefaultRender && field.AllowMultipleValues;
    var inlineMultiUserRender = defaultMultiUserRender && field.InlineRender;

    if (inlineMultiUserRender) {
        var renderedUsersHtml = [];

        for (var userIndex = 0; userIndex < userField.length; userIndex++) {
            var userFieldItem = userField[userIndex];

            SetFieldClickInstrumentationData(userFieldItem, listItem);
            renderedUsersHtml.push(RenderUserFieldWorker(renderCtx, field, userFieldItem, listSchema));
        }
        if (renderedUsersHtml.length === 1)
            ret.push(renderedUsersHtml[0]);
        else if (renderedUsersHtml.length === 2)
            ret.push(StringUtil.BuildParam(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_UserFieldInlineTwo"]), renderedUsersHtml[0], renderedUsersHtml[1]));
        else if (renderedUsersHtml.length === 3)
            ret.push(StringUtil.BuildParam(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_UserFieldInlineThree"]), renderedUsersHtml[0], renderedUsersHtml[1], renderedUsersHtml[2]));
        else {
            var moreLinkOpenTagHtml = '';
            var moreLinkCloseTagHtml = '';

            if (Boolean(field.InlineRenderMoreAsLink)) {
                moreLinkOpenTagHtml = '<a href="#" onclick="return false;" class="ms-imnMoreLink ms-link">';
                moreLinkCloseTagHtml = '</a>';
            }
            var numMore = renderedUsersHtml.length - 3;

            ;
            ret.push(StringUtil.BuildParam(Encoding.HtmlEncode(window["ListView"]["Strings"]["L_UserFieldInlineMore"]), renderedUsersHtml[0], renderedUsersHtml[1], renderedUsersHtml[2], moreLinkOpenTagHtml, String(numMore), moreLinkCloseTagHtml));
        }
    }
    else {
        if (defaultMultiUserRender)
            ret.push("<table style='padding:0px; border-spacing:0px; border:none'><tr><td class='ms-vb'>");
        var bFirst = true;

        for (var idx in userField) {
            if (bFirst)
                bFirst = false;
            else if (field.AllowMultipleValues) {
                if (defaultMultiUserRender)
                    ret.push("</td></tr><tr><td class='ms-vb'>");
                else if (!field.WithPicture && !field.WithPictureDetail && !field.PictureOnly)
                    ret.push("; ");
            }
            var userItem = userField[idx];

            SetFieldClickInstrumentationData(userItem, listItem);
            ret.push(RenderUserFieldWorker(renderCtx, field, userItem, listSchema));
        }
        if (defaultMultiUserRender)
            ret.push("</td></tr></table>");
    }
    return ret.join('');
}
function RenderUserFieldWorker(renderCtx, field, listItem, listSchema) {
    var g_EmptyImnPawnHtml = "<span class='ms-spimn-presenceLink'><span class='{0}'><img class='{1}' name='imnempty' src='" + ListView.ImageBasePath + "/_layouts/15/images/spimn.png?rev=44" + "' alt='' /></span></span>";
    var g_ImnPawnHtml = "{0}<a href='#' onclick='WriteDocEngagementLog(\"DocModifiedByPresenceClick\", \"ODModifiedByPresenceClick\"); IMNImageOnClick(event);return false;' class='{1}' {2}>{3}<img name='imnmark' title='' ShowOfflinePawn='1' class='{4}' src='" + ListView.ImageBasePath + "/_layouts/15/images/spimn.png?rev=44" + "' alt='";
    var ret = [];

    function GetImnPawnHtml(userSip, userEmail, alt, pictureSize, fNoImg) {
        var imnImgClass = "ms-spimn-img";
        var imnSpanClass = "ms-spimn-presenceWrapper";
        var imnLinkClass = "ms-imnlink";
        var additionalMarkup = "";
        var wrapperSpanMarkup = "";
        var imnSpanMarkup = "";

        if (fNoImg) {
            imnSpanClass = (imnImgClass = " ms-hide");
            additionalMarkup = "tabIndex='-1'";
        }
        else {
            var height = SPClientTemplates.PresenceIndicatorSize.Square_10px;
            var width = SPClientTemplates.PresenceIndicatorSize.Square_10px;

            if (pictureSize != null && typeof pictureSize != 'undefined' && pictureSize != "None") {
                height = String(parseInt(pictureSize.substring(5)));
                if (pictureSize == "Size_72px") {
                    width = SPClientTemplates.PresenceIndicatorSize.Bar_8px;
                }
                else {
                    width = SPClientTemplates.PresenceIndicatorSize.Bar_5px;
                }
            }
            else {
                imnSpanClass += " ms-imnImg";
            }
            if (field.InlineRender) {
                imnSpanClass += " ms-imnImgInline";
            }
            var sizeClass = String.format(" ms-spimn-imgSize-{0}x{1}", width, height);

            imnImgClass += String.format(" ms-spimn-presence-disconnected-{0}x{1}x32", width, height);
            imnSpanClass += sizeClass;
            imnLinkClass += " ms-spimn-presenceLink";
            wrapperSpanMarkup = String.format("<span class='{0}'>", imnSpanClass);
            imnSpanMarkup = "<span class='ms-imnSpan'>";
        }
        if (userSip == null || userSip == '') {
            if (userEmail == null || userEmail == '') {
                ret.push(String.format(g_EmptyImnPawnHtml, imnSpanClass, imnImgClass));
            }
            else {
                ret.push(String.format(g_ImnPawnHtml, imnSpanMarkup, imnLinkClass, additionalMarkup, wrapperSpanMarkup, imnImgClass));
                ret.push(Encoding.HtmlEncode(alt));
                ret.push("' sip='");
                ret.push(Encoding.HtmlEncode(userEmail));
                ret.push("' id='imn_");
                ret.push(s_ImnId);
                ret.push(",type=smtp' />" + (wrapperSpanMarkup.length > 0 ? "</span>" : "") + "</a>" + (imnSpanMarkup.length > 0 ? "</span>" : ""));
            }
        }
        else {
            ret.push(String.format(g_ImnPawnHtml, imnSpanMarkup, imnLinkClass, additionalMarkup, wrapperSpanMarkup, imnImgClass));
            ret.push(Encoding.HtmlEncode(alt));
            ret.push("' sip='");
            ret.push(Encoding.HtmlEncode(userSip));
            ret.push("' id='imn_");
            ret.push(s_ImnId);
            ret.push(",type=sip' />" + (wrapperSpanMarkup.length > 0 ? "</span>" : "") + "</a>" + (imnSpanMarkup.length > 0 ? "</span>" : ""));
        }
        s_ImnId++;
    }
    function GetPresence(userSip, userEmail) {
        if (listSchema.EffectivePresenceEnabled && (field.DefaultRender || field.WithPicture || field.WithPictureDetail || field.PictureOnly || field.PresenceOnly)) {
            GetImnPawnHtml(userSip, userEmail, listSchema.PresenceAlt, field.PictureSize, false);
        }
    }
    function GetPresenceNoImg(userSip, userEmail) {
        if (listSchema.EffectivePresenceEnabled) {
            GetImnPawnHtml(userSip, userEmail, listSchema.PresenceAlt, null, true);
        }
    }
    function UserLinkWithSize(pictureSize) {
        var userDispParam = listSchema.UserDispParam;

        if (field.HasUserLink && (Boolean(userDispParam) || lookupId != null && lookupId != '' && parseInt(lookupId) > -1)) {
            var userDispUrlString = '';

            if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(499) && !Boolean(listSchema.UserDispUrl) && Boolean(_spPageContextInfo) && Boolean(_spPageContextInfo.webServerRelativeUrl)) {
                listSchema.UserDispUrl = Nav.combineUrl(_spPageContextInfo.webServerRelativeUrl, "_layouts/15/userdisp.aspx");
            }
            if (Boolean(listSchema.UserDispUrl)) {
                var userDispUrl;

                if (ListModule.Settings.UseAbsoluteUserDispUrl) {
                    var httpRoot = renderCtx.HttpRoot;
                    var userDispUrlServerRelative = listSchema.UserDispUrl;

                    userDispUrl = new URI(httpRoot + userDispUrlServerRelative);
                }
                else {
                    userDispUrl = new URI(listSchema.UserDispUrl);
                }
                if (Boolean(userDispParam)) {
                    userDispUrl.setQueryParameter(userDispParam, listItem[userDispParam]);
                }
                else {
                    userDispUrl.setQueryParameter("ID", String(lookupId));
                }
                userDispUrlString = userDispUrl.getString();
            }
            var linkClass = field.InlineRender ? "ms-link" : "ms-subtleLink";

            linkClass += pictureSize != null && pictureSize.length > 0 ? " ms-peopleux-imgUserLink" : "";
            if (typeof listItem.piCD != 'undefined' && listItem.piCD != "") {
                if (typeof listItem.piPC != 'undefined' && listItem.piPC != "") {
                    ret.push("<a class=\"" + linkClass + "\" onclick=\"RecordClickForPaging('Author', '" + listItem.piCD + "','" + listItem.piPC + "'); GoToLinkOrDialogNewWindow(this);return false;\" href=");
                }
                else {
                    ret.push("<a class=\"" + linkClass + "\" onclick=\"RecordClick('Author', '" + listItem.piCD + "'); GoToLinkOrDialogNewWindow(this);return false;\" href=");
                }
            }
            else if (typeof listItem.piClickClientData != 'undefined' && listItem.piClickClientData != "") {
                ret.push("<a class=\"" + linkClass + "\" onclick=\"RecordClickClientId('Author', '" + listItem.piClickClientData + "'); GoToLinkOrDialogNewWindow(this);return false;\" href=");
            }
            else {
                ret.push("<a class=\"" + linkClass + "\" onclick=\"WriteDocEngagementLog('DocModifiedByNameClick', 'ODModifiedByNameClick'); if(typeof(WriteSearchClickLog) != 'undefined'){ WriteSearchClickLog(event); }; GoToLinkOrDialogNewWindow(this);return false;\" href=");
            }
            ret.push(Encoding.AttrQuote(userDispUrlString));
            ret.push(">");
        }
    }
    function UserLink() {
        UserLinkWithSize(null);
    }
    function RenderUserTitle(title) {
        ret.push("<span class=\"ms-noWrap ms-imnSpan\">");
        GetPresenceNoImg(sip, email);
        UserLink();
        ret.push(Encoding.HtmlEncode(title));
        if (field.HasUserLink)
            ret.push("</a>");
        ret.push("</span>");
    }
    var lookupId = listItem.id;
    var lookupValue;

    if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(364)) {
        if (Boolean(field.AllowMultipleValues) && Boolean(listItem.value)) {
            lookupValue = listItem.value;
        }
        else {
            lookupValue = listItem.title;
        }
    }
    else {
        lookupValue = listItem.title;
    }
    if (lookupValue == null || lookupValue == '') {
        ret.push("<span class=\"ms-floatLeft ms-peopleux-vanillaUser\" />");
        return ret.join('');
    }
    var sip = listItem.sip;
    var email = listItem.email;

    function RenderVanillaUser() {
        if (!listSchema.UserVanilla) {
            if (ListModule.Settings.SupportsPeopleHoverCard) {
                ret.push("<span class=\"ms-verticalAlignTop ms-noWrap ms-displayInlineBlock\" " + GetSharedHoverCardFieldsMarkup() + ">");
            }
            else {
                ret.push("<span class=\"ms-verticalAlignTop ms-noWrap ms-displayInlineBlock\">");
            }
            GetPresence(sip, email);
            RenderUserTitle(lookupValue);
            ret.push("</span>");
        }
        else {
            if (ListModule.Settings.SupportsPeopleHoverCard) {
                ret.push("<span " + GetSharedHoverCardFieldsMarkup() + ">");
            }
            RenderUserTitle(lookupValue);
            if (ListModule.Settings.SupportsPeopleHoverCard) {
                ret.push("</span>");
            }
        }
    }
    function GetSharedHoverCardFieldsMarkup() {
        return " name='SharedHoverCardMarker'" + "sip='" + Encoding.HtmlEncode(GetUserEmail()) + "' " + "userTitle='" + Encoding.HtmlEncode(GetUserTitle()) + "' ";
    }
    function GetUserTitle() {
        var userTitle = lookupValue;

        if (userTitle == null) {
            userTitle = '';
        }
        return userTitle;
    }
    function GetUserEmail() {
        var userSip = sip;

        if (userSip == null || userSip == '') {
            userSip = email;
        }
        return userSip == null ? '' : userSip;
    }
    var ProfilePicture_Suffix_Small = "_SThumb";
    var ProfilePicture_Suffix_Medium = "_MThumb";
    var ProfilePicture_Suffix_Large = "_LThumb";
    var SmallThumbnailThreshold = 48;

    function GetPictureThumbnailUrl(pictureUrl, suffixToReplace) {
        var fileNameWithoutExt = pictureUrl.substr(0, pictureUrl.lastIndexOf("."));

        if (fileNameWithoutExt.endsWith(ProfilePicture_Suffix_Medium)) {
            if (suffixToReplace == ProfilePicture_Suffix_Medium)
                return pictureUrl;
            return pictureUrl.replace(ProfilePicture_Suffix_Medium, suffixToReplace);
        }
        return pictureUrl;
    }
    function AppendUserPhotoUrl(arrayToAppend, sizeToRequest, pictureUrl) {
        if (!(window["OffSwitch"] == null || OffSwitch.IsActive("4BF41ED4-46A6-4A0F-8641-2AA7AFED55D7"))) {
            arrayToAppend.push(_spPageContextInfo.webServerRelativeUrl);
        }
        arrayToAppend.push("/_layouts/15/userphoto.aspx");
        arrayToAppend.push('?size=');
        arrayToAppend.push(encodeURIComponent(sizeToRequest));
        var accountName = Boolean(listItem.accountname) ? listItem.accountname : listItem.email;

        if (Boolean(accountName)) {
            arrayToAppend.push('&accountname=');
            arrayToAppend.push(encodeURIComponent(accountName));
        }
        if (Boolean(pictureUrl)) {
            arrayToAppend.push('&url=');
            arrayToAppend.push(encodeURIComponent(pictureUrl));
            try {
                var pictureUrlAsUri = new URI(pictureUrl);
                var timestamp = pictureUrlAsUri.getQueryParameter('t');

                if (Boolean(timestamp)) {
                    arrayToAppend.push('&t=');
                    arrayToAppend.push(encodeURIComponent(timestamp));
                }
            }
            catch (e) { }
        }
    }
    function RenderPicture(fieldToRender) {
        var picture = listItem.picture;
        var pictureSize = fieldToRender.PictureSize != null ? Encoding.HtmlEncode(fieldToRender.PictureSize.substring(5)) : null;

        ret.push("<span class=\"ms-imnSpan\">");
        GetPresenceNoImg(sip, email);
        if (field.HasUserLink)
            UserLinkWithSize(pictureSize);
        else
            ret.push("<span class=\"ms-peopleux-imgUserLink\">");
        if (pictureSize != null) {
            ret.push("<span class=\"ms-peopleux-userImgWrapper\" style=\"width:" + pictureSize + "; height:" + pictureSize + "\">");
            ret.push("<img class=\"ms-peopleux-userImg\" style=\"min-width:" + pictureSize + "; min-height:" + pictureSize + "; ");
            ret.push("clip:rect(0px, " + pictureSize + ", " + pictureSize + ", 0px); max-width:" + pictureSize + "\" src=\"");
        }
        else {
            pictureSize = "62px";
            ret.push("<img style=\"width:62px; height:62px; border:none\" src=\"");
        }
        var sizeToRequest = CSSUtil.pxToNum(pictureSize) <= SmallThumbnailThreshold ? 'S' : 'M';

        if (picture == null || picture == '') {
            if (ListModule.Settings.SupportsCrossDomainPhotos && _spPageContextInfo.crossDomainPhotosEnabled) {
                AppendUserPhotoUrl(ret, sizeToRequest, '');
            }
            else {
                ret.push(ListView.ImageBasePath + "/_layouts/15/images/person.gif?rev=44");
            }
            ret.push("\" alt=\"");
            ret.push(Encoding.HtmlEncode(listSchema.picturealt1));
            ret.push(" ");
            ret.push(Encoding.HtmlEncode(lookupValue));
            ret.push("\" />");
        }
        else {
            if (parseInt(pictureSize) <= SmallThumbnailThreshold) {
                picture = GetPictureThumbnailUrl(picture, ProfilePicture_Suffix_Small);
            }
            if (!ListModule.Settings.SupportsCrossDomainPhotos || !_spPageContextInfo.crossDomainPhotosEnabled || picture.startsWith('/') || (picture.toLowerCase()).startsWith((ListModule.Util.getHostUrl(window.location.href)).toLowerCase())) {
                ret.push(Encoding.HtmlEncode(picture));
            }
            else {
                AppendUserPhotoUrl(ret, sizeToRequest, picture);
            }
            ret.push("\" alt=\"");
            ret.push(Encoding.HtmlEncode(listSchema.picturealt2));
            ret.push(" ");
            ret.push(Encoding.HtmlEncode(lookupValue));
            ret.push("\" />");
        }
        if (pictureSize != null)
            ret.push("</span>");
        if (field.HasUserLink)
            ret.push("</a>");
        else
            ret.push("</span>");
        ret.push("</span>");
    }
    var picSize = "0px";

    if (field.PictureSize != null && typeof field.PictureSize != 'undefined')
        picSize = Encoding.HtmlEncode(field.PictureSize.substring(5));
    if (field.WithPictureDetail) {
        var jobTitle = listItem.jobTitle;
        var department = listItem.department;

        if (picSize == null || typeof picSize == 'undefined') {
            picSize = "36px";
        }
        var detailsMaxWidth = 150;

        if (field.MaxWidth != null && typeof field.MaxWidth != 'undefined') {
            detailsMaxWidth = field.MaxWidth - 10 - parseInt(picSize) - 11;
            if (detailsMaxWidth < 0) {
                detailsMaxWidth = 0;
            }
        }
        if (ListModule.Settings.SupportsPeopleHoverCard) {
            ret.push("<div class=\"ms-table ms-core-tableNoSpace\" " + GetSharedHoverCardFieldsMarkup() + ">");
        }
        else {
            ret.push("<div class=\"ms-table ms-core-tableNoSpace\">");
        }
        ret.push("<div class=\"ms-tableRow\">");
        ret.push("<div class=\"ms-tableCell\">");
        GetPresence(sip, email);
        ret.push("</span></div><div class=\"ms-tableCell ms-verticalAlignTop\"><div class=\"ms-peopleux-userImgDiv\">");
        RenderPicture(field);
        ret.push("</div></div><div class=\"ms-tableCell ms-peopleux-userdetails ms-noList\"><ul style=\"max-width:" + String(detailsMaxWidth) + "px\"><li>");
        ret.push("<div class=\"ms-noWrap" + (parseInt(picSize) >= 48 ? " ms-textLarge" : "") + "\">");
        RenderUserTitle(lookupValue);
        ret.push("</div>");
        ret.push("</li>");
        var customDetail = listItem.CustomDetail;
        var renderCallback = field.RenderCallback;

        if (renderCallback != null || typeof renderCallback != 'undefined') {
            renderCtx.sip = sip;
            var result = eval(renderCallback + "(renderCtx);");

            ret.push("<li>");
            ret.push(result);
            ret.push("</li>");
        }
        else if (customDetail != null || typeof customDetail != 'undefined') {
            ret.push("<li><div class=\"ms-metadata ms-textSmall ms-peopleux-detailuserline ms-noWrap\" title=\"" + Encoding.HtmlEncode(customDetail) + "\">");
            ret.push(Encoding.HtmlEncode(customDetail));
            ret.push("</div></li>");
        }
        else if (jobTitle != null && jobTitle != '') {
            var detailLine = jobTitle;

            if (department != null && department != '')
                detailLine += ", " + department;
            ret.push("<li><div class=\"ms-metadata ms-textSmall ms-peopleux-detailuserline\" title=\"" + Encoding.HtmlEncode(detailLine) + "\">");
            ret.push(Encoding.HtmlEncode(detailLine));
            ret.push("</div></li>");
        }
        ret.push("</ul></div></div></div>");
    }
    else if (field.PictureOnly) {
        if (ListModule.Settings.SupportsPeopleHoverCard) {
            ret.push("<div class=\"ms-table ms-core-tableNoSpace\" " + GetSharedHoverCardFieldsMarkup() + ">");
            ret.push("<div class=\"ms-tableRow\"><div class=\"ms-tableCell\">");
        }
        else {
            ret.push("<div class=\"ms-table ms-core-tableNoSpace\"><div class=\"ms-tableRow\"><div class=\"ms-tableCell\">");
        }
        GetPresence(sip, email);
        ret.push("</span></div><div class=\"ms-tableCell ms-verticalAlignTop\"><div class=\"ms-peopleux-userImgDiv\">");
        RenderPicture(field);
        ret.push("</div></div></div></div>");
    }
    else if (field.WithPicture) {
        ret.push("<div><div>");
        RenderPicture(field);
        ret.push("</div><div class=\"ms-floatLeft ms-descriptiontext\">");
        RenderVanillaUser();
        ret.push("</div></div>");
    }
    else if (field.NameWithContactCard) {
        if (ListModule.Settings.SupportsPeopleHoverCard) {
            ret.push("<span " + GetSharedHoverCardFieldsMarkup() + ">");
        }
        RenderUserTitle(lookupValue);
        if (ListModule.Settings.SupportsPeopleHoverCard) {
            ret.push("</span>");
        }
    }
    else if (field.PresenceOnly) {
        GetPresence(sip, email);
    }
    else
        RenderVanillaUser();
    return ret.join('');
}
function RenderAndRegisterHierarchyItem(renderCtx, field, listItem, listSchema, content) {
    if (renderCtx.inGridMode) {
        return content;
    }
    var indentSize = renderCtx.ListData.HierarchyHasIndention ? 22 : 0;
    var imgOffsetSize = renderCtx.ListData.HierarchyHasIndention ? 13 : 0;
    var ret = [];
    var trId = renderCtx.ctxId + ',' + listItem.ID + ',' + listItem.FSObjType;
    var imgId = 'idExpandCollapse' + trId;

    ret.push('<span style="');
    if (listItem.isParent) {
        ret.push('font-weight: bold;');
    }
    ret.push('float: ');
    ret.push(DOM.rightToLeft ? 'right' : 'left');
    ret.push('; margin-');
    ret.push(DOM.rightToLeft ? 'right' : 'left');
    ret.push(':');
    var outlineLevel = parseInt(listItem.outlineLevel);

    if (outlineLevel <= 1) {
        indentLevel = listItem.isParent ? 0 : imgOffsetSize;
    }
    else {
        var indentLevel = (outlineLevel - 1) * indentSize;

        if (!listItem.isParent) {
            indentLevel += imgOffsetSize;
        }
    }
    ret.push(indentLevel);
    ret.push('px">');
    ret.push('<table><tr>');
    if (listItem.isParent) {
        ret.push('<td style="vertical-align: top;"><span id="');
        ret.push(imgId);
        ret.push('" class="ms-commentcollapse' + (DOM.rightToLeft ? 'rtl' : '') + '-iconouter"><img src="');
        ret.push(GetThemedImageUrl("spcommon.png"));
        ret.push('" class="ms-commentcollapse' + (DOM.rightToLeft ? 'rtl' : '') + '-icon"/></span></td>');
    }
    ret.push('<td>');
    ret.push(content);
    ret.push('</td></tr></table></span>');
    function PostRenderRegisterHierarchyItem() {
        var hierarchyMgr = renderCtx.hierarchyMgr;

        if (hierarchyMgr == null) {
            hierarchyMgr = (renderCtx.hierarchyMgr = GetClientHierarchyManagerForWebpart(renderCtx.wpq, DOM.rightToLeft));
        }
        if (listItem.isParent) {
            var img = document.getElementById(imgId);

            if (img != null) {
                $addHandler(img, 'click', OnExpandCollapseButtonClick);
            }
            EnsureScriptFunc("core.js", "GetAncestorByTagNames", function() {
                var trElem = DOM_afterglass.GetAncestorByTagNames(img, ["TR"]);

                if (trElem != null) {
                    trElem.style.fontWeight = 'bold';
                }
            });
        }
        hierarchyMgr.RegisterHierarchyNode(parseInt(listItem.ID), listItem.parentID == null ? null : parseInt(listItem.parentID), trId, imgId);
    }
    AddPostRenderCallback(renderCtx, function() {
        setTimeout(PostRenderRegisterHierarchyItem, 0);
    });
    return ret.join('');
}
function OnPostRenderTabularListView(renderCtx) {
    setTimeout(function() {
        OnPostRenderTabularListViewDelayed(renderCtx);
    }, 100);
}
function OnPostRenderTabularListViewDelayed(renderCtx) {
    if (ListModule.Settings.SupportsDelayLoading) {
        if (renderCtx != null && renderCtx.clvp != null) {
            var listTable = renderCtx.clvp.tab;
        }
        if (listTable != null) {
            if (IsTouchSupported()) {
                var rows = listTable.rows;

                if (rows != null && rows.length > 0) {
                    var headerRow = rows[0];
                    var headerCells = headerRow.cells;

                    for (var i = 0; i < headerCells.length; i++) {
                        var curCell = headerCells[i];

                        CoreInvoke("RegisterTouchOverride", curCell, ListHeaderTouchHandler);
                        var titleDiv = (curCell.getElementsByClassName("ms-vh-div"))[0];

                        if (titleDiv != null) {
                            var sortLink = (titleDiv.getElementsByClassName("ms-headerSortTitleLink"))[0];

                            if (sortLink != null) {
                                CoreInvoke("RegisterTouchOverride", sortLink, ListHeaderTouchHandler);
                            }
                        }
                    }
                }
            }
        }
        else {
            setTimeout(function() {
                OnPostRenderTabularListViewDelayed(renderCtx);
            }, 100);
        }
    }
}
function ListHeaderTouchHandler(evt) {
    if (ListModule.Settings.SupportsTouch) {
        return _ListHeaderTouchHandler(evt);
    }
    return false;
}
function SPMgr() {
    this.NewGroup = function(listItem, fieldName) {
        if (listItem[fieldName] == '1')
            return true;
        else
            return false;
    };
    function DefaultRenderField(renderCtx, field, listItem, listSchema) {
        if (typeof field.FieldRenderer == 'undefined') {
            var fieldRenderMap = {
                Computed: new ComputedFieldRenderer(field.Name),
                Attachments: new AttachmentFieldRenderer(field.Name),
                User: new UserFieldRenderer(field.Name),
                UserMulti: new UserFieldRenderer(field.Name),
                URL: new UrlFieldRenderer(field.Name),
                Note: new NoteFieldRenderer(field.Name),
                Recurrence: new RecurrenceFieldRenderer(field.Name),
                CrossProjectLink: new ProjectLinkFieldRenderer(field.Name),
                AllDayEvent: new AllDayEventFieldRenderer(field.Name),
                Number: new NumberFieldRenderer(field.Name),
                BusinessData: new BusinessDataFieldRenderer(field.Name),
                Currency: new NumberFieldRenderer(field.Name),
                DateTime: new DateTimeFieldRenderer(field.Name),
                Text: new TextFieldRenderer(field.Name),
                Lookup: new LookupFieldRenderer(field.Name),
                LookupMulti: new LookupFieldRenderer(field.Name),
                WorkflowStatus: new RawFieldRenderer(field.Name)
            };

            if (field.XSLRender == '1') {
                field.FieldRenderer = new RawFieldRenderer(field.Name);
            }
            else {
                field.FieldRenderer = fieldRenderMap[field.FieldType];
                if (field.FieldRenderer == null)
                    field.FieldRenderer = fieldRenderMap[field.Type];
            }
            if (field.FieldRenderer == null)
                field.FieldRenderer = new FieldRenderer(field.Name);
        }
        return field.FieldRenderer.RenderField(renderCtx, field, listItem, listSchema);
    }
    function isFieldTitleHasEmbededHTML(fdType, title) {
        if (fdType == 'Calculated' || fdType == 'Recurrence' || fdType == 'CrossProjectLink') {
            return true;
        }
        if (title.indexOf("<") != -1 && title.indexOf(">") != -1) {
            return true;
        }
        return false;
    }
    function RenderFieldHeaderCore(renderCtx, listSchema, field) {
        var iStr;

        if (field.Sortable != 'FALSE') {
            var listData = renderCtx.ListData;

            iStr = '<a class="ms-headerSortTitleLink" id="diidSort';
            iStr += renderCtx.ctxId;
            iStr += field.Name;
            iStr += '" onfocus="OnFocusFilter(this)"';
            if (!field.IconOnlyHeader) {
                iStr += ' onclick="javascript: WriteDocEngagementLog(\'Documents_SortColumnClick\', \'OneDrive_SortColumnClick\'); var pointerType = this.getAttribute(\'pointerType\'); if (pointerType != null && typeof MSPointerEvent != \'undefined\' && Number(pointerType) != MSPointerEvent.MSPOINTER_TYPE_MOUSE) { ListHeaderTouchHandler(event); return false; } return OnClickFilter(this, event);"';
            }
            iStr += 'href="javascript: " SortingFields="';
            iStr += SortFields(field, listData, listSchema);
            iStr += '" Title="';
            if (ListModule.Settings.SupportsDoclibAccessibility) {
                var ariaLabel;

                if (field.IconOnlyHeader) {
                    field.role = "image";
                    var iconname = Boolean(field.Name == 'DocIcon') ? window["ListView"]["Strings"]["L_Fldheader_Type"] : field.Name;

                    ariaLabel = String.format("{0}, {1} {2}", iconname, window["ListView"]["Strings"]["L_ColumnHeadClickSortByAriaLabel"], iconname);
                }
                else if (!isFieldTitleHasEmbededHTML(field.FieldType, field.FieldTitle)) {
                    ariaLabel = String.format("{0}, {1} {2}", field.FieldTitle, window["ListView"]["Strings"]["L_ColumnHeadClickSortByAriaLabel"], field.FieldTitle);
                }
                else {
                    ariaLabel = field.Name;
                }
                iStr += Encoding.HtmlEncode(ariaLabel);
            }
            else {
                iStr += window["ListView"]["Strings"]["L_OpenMenuKeyAccessible"];
            }
            iStr += '">';
            iStr += field.FieldTitle;
            iStr += '</a>';
            iStr += RenderFieldHeaderCore_RenderSortArrowGlyph(renderCtx, field);
            iStr += RenderFieldHeaderCore_RenderFilterGlyph(renderCtx, field);
        }
        else if (field.Filterable != 'FALSE') {
            iStr = '<span id="diidSort';
            iStr += renderCtx.ctxId;
            iStr += field.Name;
            if (ListModule.Settings.SupportsDoclibAccessibility) {
                field.role = "button";
                field.ariaLabel = Encoding.HtmlEncode(String.format("{0}, {1}", field.FieldTitle, window["ListView"]["Strings"]["L_Fld_SortFilterOpt_Alt"]));
                iStr += '" role="button" aria-haspopup="true" aria-label="' + field.ariaLabel;
            }
            iStr += '">';
            iStr += field.FieldTitle;
            iStr += '</span>';
            iStr += RenderFieldHeaderCore_RenderFilterGlyph(renderCtx, field);
        }
        else {
            iStr = "<span title=\"" + window["ListView"]["Strings"]["L_CSR_NoSortFilter"] + "\">" + field.FieldTitle + "</span>";
        }
        return iStr;
    }
    function RenderFieldHeaderCore_RenderSortArrowGlyph(renderCtx, field) {
        var iStr;
        var listData = renderCtx.ListData;
        var bShowSortIcon = field.Name == listData.Sortfield;
        var bAscending = listData.SortDir == 'ascending';
        var spanClass = bAscending ? "ms-sortarrowup-iconouter" : "ms-sortarrowdown-iconouter";
        var imgClass = bAscending ? "ms-sortarrowup-icon" : "ms-sortarrowdown-icon";

        iStr = '<span class="' + spanClass + '"';
        iStr += ' id="diidSortArrowSpan';
        iStr += renderCtx.ctxId;
        iStr += field.Name;
        iStr += '"';
        if (!bShowSortIcon) {
            iStr += ' style="display: none;"';
        }
        iStr += '><img class="' + imgClass + '" src="' + GetThemedImageUrl("spcommon.png") + '" alt="" /></span>';
        return iStr;
    }
    function RenderFieldHeaderCore_RenderFilterGlyph(renderCtx, field) {
        var iStr;
        var listData = renderCtx.ListData;
        var bShowFilterIcon = listData.FilterFields != null && listData.FilterFields.indexOf(';' + field.Name + ';') >= 0;

        iStr = '<span class="ms-filter-iconouter"';
        iStr += ' id="diidFilterSpan';
        iStr += renderCtx.ctxId;
        iStr += field.Name;
        iStr += '"';
        if (!bShowFilterIcon) {
            iStr += ' style="display: none;"';
        }
        iStr += '><img class="ms-filter-icon" src="' + GetThemedImageUrl("spcommon.png") + '" alt="" /></span>';
        return iStr;
    }
    function RenderHeaderField(renderCtx, field) {
        var listSchema = renderCtx.ListSchema;
        var listData = renderCtx.ListData;

        if (listSchema.Filter == '1')
            return field.Filter;
        var iStr;

        if (field.Type == "Number" || field.Type == "Currency") {
            iStr = '<div align="right" class="ms-numHeader">';
            iStr += RenderFieldHeaderCore(renderCtx, listSchema, field);
            iStr += '</div>';
        }
        else {
            iStr = RenderFieldHeaderCore(renderCtx, listSchema, field);
        }
        if (field.FieldType == 'BusinessData' && ListModule.Settings.SupportsBusinessDataField) {
            iStr += '<a style="padding-left:2px;padding-right:12px" onmouseover="" onclick="GoToLinkOrDialogNewWindow(this);return false;" href="';
            iStr += listSchema.HttpVDir;
            iStr += '/_layouts/15/BusinessDataSynchronizer.aspx?ListId=';
            iStr += renderCtx.listName;
            iStr += '&ColumnName=';
            iStr += field.Name;
            iStr += '"><img border="0" src="' + ListView.ImageBasePath + '/_layouts/15/images/bdupdate.gif' + '" alt="';
            iStr += window["ListView"]["Strings"]["L_BusinessDataField_UpdateImageAlt"];
            iStr += '" title="';
            iStr += window["ListView"]["Strings"]["L_BusinessDataField_UpdateImageAlt"];
            iStr += '"/></a>';
        }
        return iStr;
    }
    function SortFields(field, listData, listSchema) {
        var iStr = listSchema.RootFolderParam;

        iStr += listSchema.FieldSortParam;
        iStr += 'SortField=';
        iStr += field.Name;
        iStr += '&SortDir=';
        if (listData.SortField == field.Name && (listData.SortDir == "ascending" || listData.SortDir == "ASC"))
            iStr += "Desc";
        else
            iStr += "Asc";
        return iStr;
    }
    function RenderDVTHeaderField(renderCtx, field) {
        var listSchema = renderCtx.ListSchema;
        var listData = renderCtx.ListData;
        var iStr = "";

        iStr += '<div Sortable="';
        iStr += field.Sortable == null ? '' : field.Sortable;
        iStr += '" SortDisable="" FilterDisable="" Filterable="';
        iStr += field.Filterable == null ? '' : field.Filterable;
        iStr += '" FilterDisableMessage="';
        iStr += field.FilterDisableMessage == null ? '' : field.FilterDisableMessage;
        iStr += '" name="';
        iStr += field.Name;
        iStr += '" CTXNum="';
        iStr += renderCtx.ctxId;
        iStr += '" DisplayName="';
        iStr += Encoding.HtmlEncode(field.DisplayName);
        iStr += '" FieldType="';
        iStr += field.FieldType;
        iStr += '" ResultType="';
        iStr += field.ResultType == null ? '' : field.ResultType;
        iStr += '" SortFields="';
        iStr += SortFields(field, listData, listSchema);
        iStr += '" class="ms-vh-div">';
        iStr += RenderHeaderField(renderCtx, field);
        iStr += '</div>';
        if (field.Sortable != 'FALSE' && field.Type != 'MultiChoice' || field.Filterable != 'FALSE' && field.Type != 'Note' && field.Type != 'URL') {
            var sortfilterlabel = Encoding.HtmlEncode(String.format(window["ListView"]["Strings"]["L_OpenFilterMenu"], field.DisplayName));

            iStr += '<div class="ms-positionRelative">';
            iStr += '<div class="s4-ctx"><span> </span><a onfocus="OnChildColumn(this.parentNode.parentNode.parentNode); return false;" ';
            iStr += 'class="ms-headerSortArrowLink" onclick="WriteDocEngagementLog(\'Documents_SortArrowClick\', \'OneDrive_SortArrowClick\'); PopMenuFromChevron(event); return false;" href="javascript:;" title="';
            iStr += sortfilterlabel;
            iStr += '" aria-expended="false"><img style="visibility: hidden;" src="' + GetThemedImageUrl("ecbarw.png") + '" alt="';
            iStr += sortfilterlabel;
            iStr += '" ms-jsgrid-click-passthrough="true"></a><span> </span></div>';
            iStr += '</div>';
        }
        return iStr;
    }
    function RenderIconHeader(renderCtx, field, imageUrl, bAttachment) {
        var iStr = '<th class="ms-vh-icon ms-minWidthHeader" role="columnheader" scope="col" onmouseover="OnChildColumn(this)">';

        field.FieldTitle = '<img border="0" width="16" height="16" ';
        if (bAttachment)
            field.FieldTitle += 'alt=' + Encoding.AttrQuote(window["ListView"]["Strings"]["L_ListFieldAttachments"]) + ' ';
        else
            field.FieldTitle += 'alt=' + Encoding.AttrQuote(Boolean(field.Name == 'DocIcon') ? window["ListView"]["Strings"]["L_Fldheader_Type"] : field.Name) + ' ';
        field.FieldTitle += 'src="' + imageUrl + '"/>';
        field.IconOnlyHeader = true;
        iStr += RenderDVTHeaderField(renderCtx, field);
        iStr += '</th>';
        return iStr;
    }
    function RenderAttachmentsHeader(renderCtx, field) {
        return RenderIconHeader(renderCtx, field, GetThemedImageUrl("attach16.png"), true);
    }
    function RenderComputedHeader(renderCtx, field) {
        if (field.Name == "DocIcon" && field.RealFieldName == "DocIcon")
            return RenderIconHeader(renderCtx, field, ListView.ImageBasePath + '/_layouts/15/images/icgen.gif');
        else
            return RenderDefaultHeader(renderCtx, field);
    }
    function RenderSelectedFlagHeader(renderCtx, field) {
        var iStr = '<th scope="col" class="ms-vh3-nograd" role="columnheader">';

        iStr += '<img id="diidHeaderImageSelectedFlag" alt="';
        iStr += window["ListView"]["Strings"]["L_SPSelection_Checkbox"];
        iStr += '" src="' + ListView.ImageBasePath + '/_layouts/15/images/blank.gif' + '" width="16" height="16" border="0"/>';
        iStr += '</th>';
        return iStr;
    }
    function RenderCheckmarkHeader(renderCtx, field) {
        var ret = [];
        var content = [];

        content.push('<div class="ms-chkmark-container" style="cursor: default;">');
        content.push('<div class="ms-chkmark-container-centerer">');
        content.push('<span class="ms-cui-img-16by16 ms-cui-img-cont-float" unselectable="on">');
        content.push('<img class="ms-chkmark-marktaskcomplete" src="');
        content.push(GetThemedImageUrl('spcommon.png'));
        content.push('"/></span></div></div>');
        field.FieldTitle = content.join('');
        ret.push('<th scope="col" class="ms-vh2" role="columnheader" style="padding-left: 5px;width: 50px;" onmouseover="OnChildColumn(this)" onmousedown="ListModule.Util.headerMenuMouseDown(this);" scope="col">');
        ret.push(RenderDVTHeaderField(renderCtx, field));
        ret.push('</th>');
        return ret.join('');
    }
    function RenderDateTimeHeader(renderCtx, field) {
        var iStr = '<th class="ms-vh2" role="columnheader" scope="col" onmouseover="OnChildColumn(this)" onmousedown="ListModule.Util.headerMenuMouseDown(this);">';

        field.FieldTitle = Encoding.HtmlEncode(field.DisplayName);
        iStr += RenderDVTHeaderField(renderCtx, field);
        iStr += '</th>';
        return iStr;
    }
    function RenderRecurrenceHeader(renderCtx, field) {
        var iStr = '<th class="ms-vh-icon" role="columnheader" scope="col" onmouseover="OnChildColumn(this)" onmousedown="ListModule.Util.headerMenuMouseDown(this);">';

        field.FieldTitle = '<IMG id="diidHeaderImagefRecurrence" src="' + ListView.ImageBasePath + '/_layouts/15/images/recurrence.gif' + '" width="16" height="16" border="0" >';
        iStr += RenderDVTHeaderField(renderCtx, field);
        iStr += '</th>';
        return iStr;
    }
    function RenderDefaultHeader(renderCtx, field) {
        var iStr = '<th scope="col" role="columnheader" onmouseover="OnChildColumn(this)" style="max-width: 500px;" class="';

        if ((field.Type == 'User' || field.Type == 'UserMulti') && renderCtx.ListSchema.EffectivePresenceEnabled) {
            iStr += 'ms-vh';
        }
        else {
            iStr += field.Filterable != 'FALSE' || field.Sortable != 'FALSE' ? 'ms-vh2' : 'ms-vh2-nofilter';
        }
        if (field.Name == "DocIcon") {
            iStr += ' ms-minWidthHeader';
        }
        iStr += '" onmousedown="ListModule.Util.headerMenuMouseDown(this);">';
        field.FieldTitle = Encoding.HtmlEncode(field.DisplayName);
        iStr += RenderDVTHeaderField(renderCtx, field);
        iStr += '</th>';
        return iStr;
    }
    function RenderCrossProjectLinkHeader(renderCtx, field) {
        var iStr = '<th class="ms-vh-icon" role="columnheader" scope="col" onmouseover="OnChildColumn(this)">';
        var themedImgUrl = GetThemedImageUrl("mtgicnhd.gif");

        field.FieldTitle = '<IMG id="diidHeaderImageWorkspaceLink" src="' + themedImgUrl + '" width="16" height="16" border="0" >';
        iStr += RenderDVTHeaderField(renderCtx, field);
        iStr += '</th>';
        return iStr;
    }
    this.RenderHeader = function(renderCtx, field) {
        if (field.Name == 'SelectedFlag')
            return RenderSelectedFlagHeader(renderCtx, field);
        else if (field.Name == 'Checkmark')
            return RenderCheckmarkHeader(renderCtx, field);
        var fieldHeaderRenderMap = {
            Attachments: RenderAttachmentsHeader,
            Computed: RenderComputedHeader,
            CrossProjectLink: RenderCrossProjectLinkHeader,
            Recurrence: RenderRecurrenceHeader,
            DateTime: RenderDateTimeHeader
        };
        var headerRenderer = fieldHeaderRenderMap[field.Type];

        if (headerRenderer != null)
            return headerRenderer(renderCtx, field);
        return RenderDefaultHeader(renderCtx, field);
    };
    this.RenderField = function(renderCtx, field, listItem, listSchema) {
        if (typeof field.fieldRenderer == 'undefined') {
            var fieldTpls = renderCtx.Templates['Fields'];
            var tpl;
            var fldName = field.Name;

            if (fieldTpls[fldName] != null)
                tpl = fieldTpls[fldName];
            var tplFunc;

            if (tpl != null && tpl != '' && tpl != RenderFieldValueDefault) {
                if (typeof tpl == "string")
                    tplFunc = SPClientRenderer.ParseTemplateString(tpl, renderCtx);
                else if (typeof tpl == "function")
                    tplFunc = tpl;
            }
            else
                tplFunc = DefaultRenderField;
            field.fieldRenderer = tplFunc;
        }
        renderCtx['CurrentFieldSchema'] = field;
        var retStr = field.fieldRenderer(renderCtx, field, listItem, listSchema);

        renderCtx['CurrentFieldSchema'] = null;
        if (field.Direction != null) {
            var ret = [];

            ret.push("<span dir=\"");
            ret.push(field.Direction);
            ret.push("\">");
            ret.push(retStr);
            ret.push("</span>");
            retStr = ret.join('');
        }
        if (field.linkToItem != null) {
            ret = [];
            if (listItem.FSObjType == '1') {
                if (listSchema.IsDocLib == '1') {
                    RenderDocFolderLink(renderCtx, ret, retStr, listItem, listSchema);
                }
                else {
                    RenderListFolderLink(ret, retStr, listItem, listSchema);
                }
            }
            else {
                RenderTitle(ret, renderCtx, listItem, listSchema, LinkTitleValue(listItem[field.Name]), true);
            }
            retStr = ret.join('');
        }
        if (listSchema.UseParentHierarchy && listSchema.ParentHierarchyDisplayField == field.Name) {
            retStr = RenderAndRegisterHierarchyItem(renderCtx, field, listItem, listSchema, retStr);
        }
        var isCustomData = listItem["CustomData."];

        if (isCustomData == null || typeof isCustomData == 'undefined' || Boolean(isCustomData) == false) {
            if (field.CalloutMenu != null) {
                retStr = RenderCalloutMenu(renderCtx, listItem, field, retStr, IsCSRReadOnlyTabularView(renderCtx));
            }
            else if (field.listItemMenu != null) {
                retStr = RenderECB(renderCtx, listItem, field, retStr, IsCSRReadOnlyTabularView(renderCtx));
            }
        }
        return retStr;
    };
    this.RenderFieldByName = function(renderCtx, fieldName, listItem, listSchema) {
        var ret = '';
        var rendered = false;

        for (var idx in listSchema.Field) {
            var field = listSchema.Field[idx];

            if (field.Name == fieldName) {
                var oldField = renderCtx.CurrentFieldSchema;

                renderCtx.CurrentFieldSchema = field;
                ret = this.RenderField(renderCtx, field, listItem, listSchema);
                renderCtx.CurrentFieldSchema = oldField;
                rendered = true;
                break;
            }
        }
        if (!rendered)
            ret = Encoding.HtmlEncode(listItem[fieldName]);
        return ret;
    };
}
var spMgr;

function OnTableMouseDown(evt) {
    if (evt == null) {
        evt = window.event;
    }
    if (evt.ctrlKey || evt.shiftKey) {
        if (BrowserDetection.userAgent.ie8standard) {
            document.onselectstart = function() {
                return false;
            };
            window.setTimeout(function() {
                document.onselectstart = null;
            }, 0);
        }
        return DOM.CancelEvent(evt);
    }
    return true;
}
function FHasRowHoverBehavior(ctxCur) {
    return !BrowserDetection.userAgent.ie8down && !BrowserDetection.userAgent.ipad && ctxCur != null && ctxCur.ListData != null && ctxCur.ListData.Row != null && ctxCur.ListData.Row.length < 50;
}
function AddUIInstrumentationClickEvent(ret, listItem, clickType) {
    if (typeof listItem.piCD != "undefined" && listItem.piCD != "") {
        if (typeof listItem.piPC != "undefined" && listItem.piPC != "") {
            ret.push("RecordClickForPaging('" + Encoding.HtmlEncode(clickType) + "','");
            ret.push(Encoding.HtmlEncode(listItem.piCD));
            ret.push("','");
            ret.push(Encoding.HtmlEncode(listItem.piPC));
        }
        else {
            ret.push("RecordClick('Navigation','");
            ret.push(Encoding.HtmlEncode(listItem.piCD));
        }
        ret.push("');");
    }
}
function InitializeSingleItemPictureView() {
    var SingleItemOverride = {};

    SingleItemOverride.Templates = {};
    SingleItemOverride.BaseViewID = 2;
    SingleItemOverride.ListTemplateType = 109;
    SingleItemOverride.Templates.Item = SingleItem_RenderItemTemplate;
    SingleItemOverride.Templates.Footer = SingleItem_RenderFooterTemplate;
    SingleItemOverride.Templates.Header = SingleItem_RenderHeaderTemplate;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(SingleItemOverride);
}
function SingleItem_RenderHeaderTemplate(renderCtx) {
    var listSchema = renderCtx.ListSchema;
    var ret = [];

    ret.push("<div>");
    if (listSchema.RenderViewSelectorPivotMenu == "True")
        ret.push(RenderViewSelectorPivotMenu(renderCtx));
    else if (listSchema.RenderViewSelectorPivotMenuAsync == "True")
        ret.push(RenderViewSelectorPivotMenuAsync(renderCtx));
    ret.push("</div>");
    return ret.join("");
}
function SingleItem_RenderFooterTemplate(renderCtx) {
    return "";
}
function RenderSingleItemTopPagingControl(renderCtx) {
    var ret = [];
    var strRet = "<div>";

    RenderPagingControlNew(ret, renderCtx, false, "", "topPaging");
    strRet += ret.join('');
    strRet += "</div>";
    return strRet;
}
function SingleItem_RenderItemTemplate(renderCtx) {
    var strTrTdBegin = "<tr><td colspan='100'>";
    var strTrTdEnd = "</td></tr>";
    var strRet = strTrTdBegin;

    strRet += RenderSingleItemTopPagingControl(renderCtx);
    strRet += strTrTdEnd;
    strRet += strTrTdBegin;
    strRet += SingleItem_RenderItem(renderCtx.CurrentItem);
    strRet += strTrTdEnd;
    return strRet;
}
function SingleItem_RenderItem(curItem) {
    var strImgUrl = GetPictureUrl(curItem);

    if (curItem == null)
        return null;
    var strContentType = curItem.ContentType;
    var strRet = null;

    if (curItem.FSObjType == '1') {
        strRet = "<div class=\"ms-attractMode\"><a href=\"javascript:\" onclick=ajaxNavigate.update(\"";
        strRet += GetRelativeUrlToSlideShowView(curItem);
        strRet += "\") >";
        strRet += "<img src=\"" + "/_layouts/15/" + "images/256_folder.png\" />";
        strRet += "<div>" + curItem.FileLeafRef + "</div>";
        strRet += "</a></div>";
    }
    else {
        EnsureFileLeafRefSuffix(curItem);
        if (!IsPictureFile(curItem["FileLeafRef.Suffix"])) {
            strRet = "<div class=\"ms-attractMode\">" + String.format(window["ListView"]["Strings"]["L_NotAnImageFile"], curItem.FileLeafRef) + "</div>";
        }
        else {
            strRet = "<a href=\"javascript:\" onclick='ToggleMaxWidth(this.childNodes[0])' ><img style='max-width:800px' title=\"" + window["ListView"]["Strings"]["L_ClickToZoom"] + "\" src=\"" + strImgUrl + "\" /></a>";
            strRet += "<div class=\"ms-attractMode\">" + curItem.FileLeafRef + "</div>";
        }
    }
    return strRet;
}
function GetRelativeUrlToSlideShowView(listItem) {
    if (listItem == null)
        return null;
    var info = window["_spPageContextInfo"];

    if (Boolean(info) && Boolean(info.serverRequestPath)) {
        var strUrl = escape(info.serverRequestPath);

        strUrl += "?RootFolder=";
        strUrl += URI_Encoding.encodeURIComponent(listItem.FileRef);
        return strUrl;
    }
    return null;
}
function IsPictureFile(strFileExtension) {
    if (strFileExtension == null)
        return false;
    var rgstrPictureExtensions = ["jpg", "jpeg", "bmp", "png", "gif"];

    for (var i = 0; i < rgstrPictureExtensions.length; i++) {
        if (strFileExtension.toLowerCase() == rgstrPictureExtensions[i]) {
            return true;
        }
    }
    return false;
}
function GetPictureUrl(listItem) {
    var strUrl = listItem["FileDirRef"] + "/" + listItem["FileLeafRef"];

    return EncodeUrl(strUrl);
}
function ToggleMaxWidth(elm) {
    var maxWidth = elm.style.maxWidth;

    if (maxWidth == null || maxWidth == "") {
        elm.style.maxWidth = "800px";
    }
    else {
        elm.style.maxWidth = "";
    }
}
function LoadListContextData(renderCtx) {
    var appCache = window.applicationCache;
    var ls = BrowserStorage.local;

    if (Flighting.VariantConfiguration.IsExpFeatureClientEnabled(192) && Boolean(appCache) && Boolean(appCache.status) && Boolean(ls) && Boolean(renderCtx) && renderCtx.ListTemplateType == 700 && renderCtx.BaseViewID == 51 && !Boolean(GetViewHash(renderCtx))) {
        var key = renderCtx.listName + "-" + renderCtx.view;

        if (Boolean(renderCtx.loadingAsyncData) && Boolean(renderCtx.bAppCacheRefresh)) {
            ls.setItem(key, JSON.stringify(renderCtx.ListData));
            renderCtx.bAppCacheRefresh = false;
        }
        else if (Boolean(renderCtx.bInitialRender)) {
            var data = ls.getItem(key);

            if (Boolean(data)) {
                try {
                    renderCtx.ListData = JSON.parse(data);
                }
                catch (e) {
                    ls.setItem(key, null);
                }
            }
            renderCtx.bAppCacheRefresh = true;
            renderCtx.skipNextAnimation = true;
            renderCtx.onAccessDenied = function(authRedirect) {
                if (ListModule.Util.isDefinedAndNotNullOrEmpty(authRedirect)) {
                    var uri = new URI(authRedirect);
                    var query = uri.getQueryAsObject();
                    var returnUrlParamName = "ReturnUrl";

                    uri.setQueryParameter(returnUrlParamName, Nav.ajaxNavigate.get_href());
                    window.location.href = uri.getString();
                }
            };
            AddPostRenderCallback(renderCtx, AsyncDataLoadPostRender);
        }
    }
}
$_global_clienttemplates();

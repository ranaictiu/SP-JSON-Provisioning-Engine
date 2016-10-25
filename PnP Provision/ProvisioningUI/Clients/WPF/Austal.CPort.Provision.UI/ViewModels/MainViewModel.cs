using System;
using System.ComponentModel;
using System.IO;
using System.Windows;
using System.Windows.Input;
using System.Windows.Threading;
using Provisioning.Client.Library;
using Provisioning.Client.Library.Common;
using Provisioning.Client.Library.Models;
using Provisioning.Client.WPF.Common;

namespace Provisioning.Client.WPF.ViewModels
{
    public class MainViewModel : ObservableObject
    {
        //private readonly BackgroundWorker worker = new BackgroundWorker();
        private string _currentStatus;

        public string CurrentStatus
        {
            get { return _currentStatus; }
            set
            {
                _currentStatus = value;
                RaisePropertyChangedEvent("CurrentStatus");
            }
        }


        private SiteCreationDeletionOption _siteCreationDeletionOption;

        public SiteCreationDeletionOption SiteCreationDeletionOption
        {
            get { return _siteCreationDeletionOption; }
            set
            {
                _siteCreationDeletionOption = value;
                RaisePropertyChangedEvent("SiteCreationDeletionOption");
            }
        }

        //private bool _deleteExistingSiteCollection;
        //public bool DeleteExistingSiteCollection
        //{
        //    get { return _deleteExistingSiteCollection; }
        //    set
        //    {
        //        _deleteExistingSiteCollection = value;
        //        RaisePropertyChangedEvent("DeleteExistingSiteCollection");
        //    }
        //}


        private bool _isBusy;

        public bool IsBusy
        {
            get { return _isBusy; }
            set
            {
                _isBusy = value;
                RaisePropertyChangedEvent("IsBusy");
            }
        }


        public MainViewModel()
        {
            CurrentStatus = "Ready";
            ConnectInfo = new SPOConnectionInfo
            {
                SiteUrl = "https://softract.sharepoint.com",
                CentralAdminUrl = "https://softract-admin.sharepoint.com",
                //O365TenantName = "softract",
                //SiteCollectionAdmin = "admin@softract.onmicrosoft.com",
                SiteCollectionPath = "/sites/devbld",
                UserNamePasswordProvided = true
            };
            Logger.Instance.RegisterCallback(LogToStatusBar);
        }

        public void LogToStatusBar(string status, bool isError)
        {

            Application.Current.Dispatcher.Invoke(DispatcherPriority.Background,
                                          new Action(delegate
                                          {
                                              CurrentStatus = status;
                                          }));
        }
        public ICommand ProvisionCommand => new DelegateCommand(ProvisionTemplateWithBackgroundWorker);


        private void ProvisionTemplateWithBackgroundWorker()
        {
            BackgroundWorker worker = new BackgroundWorker();
            worker.DoWork += Worker_DoWork;
            worker.RunWorkerCompleted += Worker_RunWorkerCompleted;
            IsBusy = true;
            worker.RunWorkerAsync();
        }

        private void Worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            IsBusy = false;
            if (e.Cancelled || e.Error != null)
            {
                Logger.Instance.Write(e.Error?.Message ?? "Cancelled with Error!!!");
                MessageBox.Show(Application.Current.MainWindow, "Error. Please see Log for details.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            else
                MessageBox.Show(Application.Current.MainWindow, "Processed successfully.", "Processed", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        private void Worker_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Artefacts\\PnP.xml");

                ProvisionManager provisionManager = new ProvisionManager(ConnectInfo, filePath);
                //provisionManager.SaveTemplate("aa");

                if (!provisionManager.Connect())
                {
                    e.Cancel = true;
                    throw new Exception("Failed to conenct.");
                }

                var deleteExistingSiteCollection = SiteCreationDeletionOption == SiteCreationDeletionOption.DeleteExistingAndCreateNew;
                provisionManager.RunSequences(deleteExistingSiteCollection);
            }
            catch (Exception exp)
            {
                Logger.Instance.Write(exp);
                e.Cancel = true;
                throw;
                //MessageBox.Show(Application.Current.MainWindow, "Error: " + exp.Message);
            }
        }

        private void ProvisionTemplate()
        {
            try
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Artefacts\\PnP.xml");

                ProvisionManager provisionManager = new ProvisionManager(ConnectInfo, filePath);
                //provisionManager.SaveTemplate("aa");

                if (!provisionManager.Connect())
                {
                    MessageBox.Show("Failed to connect");
                    return;
                }

                var deleteExistingSiteCollection = SiteCreationDeletionOption == SiteCreationDeletionOption.DeleteExistingAndCreateNew;
                provisionManager.RunSequences(deleteExistingSiteCollection);
                MessageBox.Show(Application.Current.MainWindow, "Processed.");
            }
            catch (Exception exp)
            {
                MessageBox.Show(Application.Current.MainWindow, "Error: " + exp.Message);
                Logger.Instance.Write(exp);
            }
        }

        public ICommand CloseCommand => new DelegateCommand(CloseWindow);

        private static void CloseWindow()
        {

            Application.Current.Shutdown();
        }

        public SPOConnectionInfo ConnectInfo { get; set; }
    }
}

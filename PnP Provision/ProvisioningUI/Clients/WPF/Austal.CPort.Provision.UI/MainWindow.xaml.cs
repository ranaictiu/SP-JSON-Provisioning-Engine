using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using Provisioning.Client.WPF.ViewModels;

namespace Provisioning.Client.WPF
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        //public MainViewModel ViewModel { get; set; }
        public MainWindow()
        {
            //ViewModel = new MainViewModel();
            InitializeComponent();
        }

        private void PasswordBox_OnPasswordChanged(object sender, RoutedEventArgs e)
        {
            var mainViewModel = ((MainViewModel) this.DataContext);
            mainViewModel.ConnectInfo.Password = (sender as PasswordBox).Password;
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            var mainViewModel = ((MainViewModel)this.DataContext);
            if (mainViewModel != null && mainViewModel.IsBusy)
            {
                e.Cancel = true;
            }
            base.OnClosing(e);
        }
    }
}

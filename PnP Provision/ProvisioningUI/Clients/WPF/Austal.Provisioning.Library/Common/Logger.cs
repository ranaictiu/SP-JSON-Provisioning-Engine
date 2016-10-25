using System;
using System.Collections.Generic;
using System.IO;

namespace Provisioning.Client.Library.Common
{
    public delegate void LoggerCallback(string status, bool isError);


    public class Logger
    {
        public List<LoggerCallback> Callbacks = new List<LoggerCallback>();

        protected string FileName;
        private static readonly object _locker = new object();
        protected Logger()
        {
            FileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, $"ProvisioningClient-{DateTime.Now.ToString("yyy-MM-dd-hh-mm-ss")}.txt");
        }

        private static Logger _instance;
        public static Logger Instance
        {
            get
            {
                if (_instance != null) return _instance;
                lock (_locker)
                {
                    if (_instance == null)
                        _instance = new Logger();
                }
                return _instance;
            }
        }


        public void RegisterCallback(LoggerCallback callback)
        {
            Callbacks.Add(callback);
        }

        public void Write(string message, params string[] parameters)
        {
            var formattedMessage = parameters != null && parameters.Length>0 ? string.Format(message, parameters) : message;
            Callbacks.ForEach(c =>
            {
                c(formattedMessage, false);
            });
            WriteToFile(formattedMessage);
        }

        public void Write(Exception exp)
        {
            Callbacks.ForEach(c =>
            {
                c(exp.Message, true);
            });
            WriteToFile($"{exp.Message}{Environment.NewLine}{exp.StackTrace}");
        }
        public void Write(string message, Exception exp)
        {
            Callbacks.ForEach(c =>
            {
                c($"{message}. {exp.Message}", true);
            });
            WriteToFile($"{message}.{exp.Message}{Environment.NewLine}{exp.StackTrace}");
        }

        private void WriteToFile(string message)
        {
            File.AppendAllText(FileName, message + Environment.NewLine);
        }

    }
}

using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Provisioning.Client.Library.PnpExtensions
{
    public static class Extensions
    {
        public static string GetTokenReplaced(this Dictionary<string, string> parameters, string text)
        {
            var replacedValue = text;
            foreach (var parameter in parameters)
            {
                var token = $"{{{parameter.Key}}}";
                if (Regex.IsMatch(replacedValue, token, RegexOptions.IgnoreCase))
                {
                    replacedValue = Regex.Replace(replacedValue, token, parameter.Value);
                }
            }
            return replacedValue;
        }
    }
}

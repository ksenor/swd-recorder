﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace SwdPageRecorder.UI
{
    public class WebElementDefinition
    {
        [Required]
        [RegularExpression(@"^[a-zA-Z_][a-zA-Z_0-9]*$", ErrorMessage = "Name should have no spaces and special characters like < $ ; > etc.")]
        public string Name { get; set;  }

        [DisplayName("Search Method")]
        public LocatorSearchMethod HowToSearch { get; set; }

        [DisplayName("Locator")]
        public string Locator { get; set; }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public string HtmlTag { get; set; }        
        
        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public WebElementLocator[] AlternativeFindBys { get; set; }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public bool ReturnsCollection { get; set; }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public WebElementHtmlAttributes AllHtmlTagProperties { get; set; }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public string Arg1 { get; set; }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public string Arg2 { get; set; }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public string Arg3 { get; set; }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public string HtmlFrameId { get; set; }

        public WebElementDefinition()
        {
            ReturnsCollection = false;
            AlternativeFindBys = new WebElementLocator[] { };
            HtmlTag = "";
            AllHtmlTagProperties = new WebElementHtmlAttributes();
        }


        public override string ToString()
        {
            return Name;
        }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public string How
        {
            get
            {
                var value = Enum.GetName(typeof(LocatorSearchMethod), this.HowToSearch);
                return value;
            }
        }

        [BrowsableAttribute(false), DefaultValueAttribute(false)]
        public string Type
        {
            get
            {
                var type = string.Empty;

                if (AllHtmlTagProperties.ContainsKey("type"))
                {
                    type = AllHtmlTagProperties["type"];
                }

                return type;
            }
        }

        public WebElementDefinition Clone()
        {
            var clone =  new WebElementDefinition()
            {
                Name = Name,
                Locator = Locator,
                HowToSearch = HowToSearch,
                HtmlTag = HtmlTag,
                ReturnsCollection = ReturnsCollection,
                Arg1 = Arg1,
                Arg2 = Arg2,
                Arg3 = Arg3,
                HtmlFrameId = HtmlFrameId,
                AllHtmlTagProperties = new WebElementHtmlAttributes(),
                AlternativeFindBys = null,
            };


            foreach (var entry in AllHtmlTagProperties)
            {
                clone.AllHtmlTagProperties.Add(entry.Key, entry.Value);
            }


            List<WebElementLocator> clonedfindBys = new List<WebElementLocator>();
            foreach (var entry in AlternativeFindBys)
            {
                clonedfindBys.Add(new WebElementLocator() 
                                      { 
                                          HowToSearch = entry.HowToSearch, 
                                          Locator = entry.Locator,
                                      });
            }

            clone.AlternativeFindBys = clonedfindBys.ToArray();

            return clone;
        }
    }
}

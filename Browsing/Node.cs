using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Browsing
{
    /// <summary>
    /// 
    /// </summary>
    public class Node
    {
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 1)]
        public string Name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 2)]
        public string Path { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 3)]
        public string Parent { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 4)]
        public string Root { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 5)]
        public bool IsFile { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 6)]
        public bool HasChildren { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 7)]
        public string Content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 8)]
        public int FileCount { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 9)]
        public int DirectoryCount { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [JsonProperty(Order = 10)]
        public List<Node> Children;

        public Node()
        {

        }
    }
}

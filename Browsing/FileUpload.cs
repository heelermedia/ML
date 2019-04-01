using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Browsing
{
    public class FileUpload
    {
        public string Path { get; set; }
        public IList<IFormFile> Files { get; set; }
        public FileUpload(IList<IFormFile> files, string path)
        {
            this.Path = path;
            this.Files = files;
        }
      
    }
}

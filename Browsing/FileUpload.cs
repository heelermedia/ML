using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Browsing
{
    public class FileUpload
    {
        public string Path { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}

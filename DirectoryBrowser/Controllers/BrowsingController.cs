using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Browsing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace DirectoryBrowser.Controllers
{
    [Route("api/browsing")]
    [ApiController]
    public class BrowsingController : ControllerBase
    {
        IBrowser _browser;
        public BrowsingController(IBrowser browser)
        {
            _browser = browser;
        }

        [HttpGet]
        public ActionResult<Node> Get(string path)
        {
            Node toReturn = _browser.GetBrowserNodes(path);
            return Ok(toReturn);
        }

        [Route("DownloadFile")]
        [HttpGet]
        public IActionResult DownloadFile(string path)
        {
            byte[] fileBytes = _browser.DownloadFile(path);
            FileExtensionContentTypeProvider provider = new FileExtensionContentTypeProvider();
            string contentType;
            string fileName = Path.GetFileName(path);
            if (!provider.TryGetContentType(fileName, out contentType))
            {
                contentType = "application/octet-stream";
            }
            ContentDisposition cd = new ContentDisposition
            {
                FileName = fileName,
                Inline = false  
            };
            Response.Headers.Add("Content-Disposition", cd.ToString());
            Response.Headers.Add("X-Content-Type-Options", "nosniff");
            return File(fileBytes, contentType, fileName);

        }

        [Route("UploadFiles")]
        [HttpPost]
        public async Task<ActionResult<Node>> UploadFiles(IList<IFormFile> files)
        {
            string path = HttpContext.Request?.Headers["X-File-Path"];
            Node node = await _browser.UploadFilesAsync(new FileUpload(files, path));
            return Ok(node);
        }

        [Route("MoveNodes")]
        [HttpPost]
        public ActionResult<Node> MoveNodes([FromBody] MoveNodes moveNodes)
        {
            Node node = _browser.MoveNodes(moveNodes);
            return Ok(node);
        }

        [Route("CopyNodes")]
        [HttpPost]
        public async Task<ActionResult<Node>> CopyNodes([FromBody] CopyNodes copyNodes)
        {
            Node node = await _browser.CopyNodesAsync(copyNodes);
            return Ok(node);
        }

        [Route("Search")]
        [HttpPost]
        public ActionResult<Node> Search([FromBody] Search searchModel)
        {
            Node node = _browser.Search(searchModel);
            return Ok(node);
        }
        [Route("CreateDirectory")]
        [HttpPut]
        public ActionResult<Node> CreateDirectory([FromBody] CreateDirectory createDirectory)
        {
            Node node = _browser.CreateDirectory(createDirectory);
            return Ok(node);
        }

        [Route("CreateFile")]
        [HttpPut]
        public ActionResult<Node> CreateFile([FromBody] CreateFile createFile)
        {
            Node node = _browser.CreateFile(createFile);
            return Ok(node);
        }

        [HttpDelete]
        public ActionResult Delete([FromBody]RemoveNodes removeNodes)
        {
            _browser.DeleteNodes(removeNodes);
            return Ok();
        }

    }
}

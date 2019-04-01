using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Browsing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        [Route("CreateDirectory")]
        [HttpPut]
        public ActionResult<Node> CreateDirectory([FromBody] CreateDirectory createDirectory)
        {
            Node node = _browser.CreateDirectory(createDirectory);
            return Ok(node);
        }

        [Route("CreateFile")]
        [HttpPut]
        public ActionResult<Node> CreateDirectory([FromBody] CreateFile createFile)
        {
            Node node = _browser.CreateFile(createFile);
            return Ok(node);
        }

        [HttpDelete]
        public ActionResult Delete(RemoveNodes removeNodes)
        {
            _browser.DeleteNodes(removeNodes);
            return Ok();
        }
    }
}

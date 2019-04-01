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
        public async Task<ActionResult<Node>> Get(string path)
        {
            Node toReturn = await _browser.GetBrowserNodesAsync(path);
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
        public async Task<ActionResult<Node>> MoveNodes([FromBody] MoveNodes moveNodes)
        {
            Node node = await _browser.MoveNodesAsync(moveNodes);
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
        public async Task<ActionResult<Node>> CreateDirectory([FromBody] CreateDirectory createDirectory)
        {
            Node node = await _browser.CreateDirectory(createDirectory);
            return Ok(node);
        }

        [Route("CreateFile")]
        [HttpPut]
        public async Task<ActionResult<Node>> CreateDirectory([FromBody] CreateFile createFile)
        {
            Node node = await _browser.CreateFile(createFile);
            return Ok(node);
        }

        [HttpDelete]
        public async Task<ActionResult> Delete(RemoveNodes removeNodes)
        {
            await _browser.DeleteNodesAsync(removeNodes);
            return Ok();
        }
    }
}

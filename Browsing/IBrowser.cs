using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Browsing
{
    /// <summary>
    /// 
    /// </summary>
    public interface IBrowser
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        Node GetBrowserNodes(string path, string searchPattern = null);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileUpload"></param>
        /// <returns></returns>
        Task<Node> UploadFilesAsync(FileUpload fileUpload);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="removeNodes"></param>
        /// <returns></returns>
        void DeleteNodes(RemoveNodes removeNodes);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="moveNodes"></param>
        /// <returns></returns>
        Node MoveNodes(MoveNodes moveNodes);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="copyNodes"></param>
        /// <returns></returns>
        Task<Node> CopyNodesAsync(CopyNodes copyNodes);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="createDirectory"></param>
        /// <returns></returns>
        Node CreateDirectory(CreateDirectory createDirectory);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="createFile"></param>
        /// <returns></returns>
        Node CreateFile(CreateFile createFile);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        Node Search(Search search);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        byte[] DownloadFile(string path);
    }
}

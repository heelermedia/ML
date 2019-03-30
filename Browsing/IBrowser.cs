﻿using System;
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
        Task<Node> GetBrowserNodesAsync(string path);
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
        Task DeleteNodesAsync(RemoveNodes removeNodes);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="moveNodes"></param>
        /// <returns></returns>
        Task<Node> MoveNodesAsync(MoveNodes moveNodes);
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
        Task<Node> CreateDirectory(CreateDirectory createDirectory);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="createFile"></param>
        /// <returns></returns>
        Task<Node> CreateFile(CreateFile createFile);
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Browsing
{
    /// <summary>
    /// 
    /// </summary>
    public class Browser : IBrowser
    {
        public Browser()
        {
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public async Task<Node> GetBrowserNodesAsync(string path)
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(path);
            Node rootNode = CreateRootNode(directoryInfo);
            rootNode.Children = new List<Node>();
            rootNode.Children.AddRange(CreateDirectoryNodes(directoryInfo));
            rootNode.Children.AddRange(CreateFileNodes(directoryInfo));
            return await Task.FromResult(rootNode);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileUpload"></param>
        /// <returns></returns>
        public async Task<Node> UploadFilesAsync(FileUpload fileUpload)
        {
            long size = fileUpload.Files.Sum(f => f.Length);
            string path = fileUpload.Path;

            foreach (IFormFile formFile in fileUpload.Files)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }

            return await GetBrowserNodesAsync(path);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="removeNodes"></param>
        /// <returns></returns>
        public async Task DeleteNodesAsync(RemoveNodes removeNodes)
        {
            await Task.Run(() =>
            {
                foreach (Node node in removeNodes.NodesToRemove)
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(node.Path);
                    if (directoryInfo.Exists)
                    {
                        directoryInfo.Delete(true);
                    }
                }
            });
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="moveNodes"></param>
        /// <returns></returns>
        public async Task<Node> MoveNodesAsync(MoveNodes moveNodes)
        {
            string path = moveNodes.ToNode.Path;
            await Task.Run(() =>
            {
                foreach (Node node in moveNodes.NodesToMove)
                {
                    string target = $"{path}/{node.Name}";
                    if (node.IsFile)
                    {
                        FileInfo fileInfo = new FileInfo(node.Path);
                        if (fileInfo.Exists)
                        {
                            File.Move(node.Path, target);
                        }
                    }
                    else
                    {
                        DirectoryInfo directoryInfo = new DirectoryInfo(node.Path);
                        if (directoryInfo.Exists)
                        {
                            Directory.Move(node.Path, target);
                        }
                    }
                }
            });
            return await GetBrowserNodesAsync(path);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="copyNodes"></param>
        /// <returns></returns>
        public async Task<Node> CopyNodesAsync(CopyNodes copyNodes)
        {
            string path = copyNodes.ToNode.Path;
            await Task.Run(async () =>
            {
                DirectoryInfo toDirectory = new DirectoryInfo(path);
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                foreach (Node node in copyNodes.NodesToCopy)
                {
                    string target = $"{path}/{node.Name}";
                    if (node.IsFile)
                    {
                        using (FileStream source = File.Open(node.Path, FileMode.Open))
                        {
                            using (FileStream destination = File.Create(target))
                            {
                                await source.CopyToAsync(destination);
                            }
                        }
                    }
                }
            });
            return await GetBrowserNodesAsync(path);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="directoryInfo"></param>
        /// <returns></returns>
        private Node CreateRootNode(DirectoryInfo directoryInfo)
        {
            return new Node
            {
                Path = directoryInfo.FullName,
                Parent = directoryInfo.Parent.FullName,
                Root = directoryInfo.Root.FullName,
                Name = directoryInfo.Name
            };
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="directoryInfo"></param>
        /// <returns></returns>
        private List<Node> CreateDirectoryNodes(DirectoryInfo directoryInfo)
        {
            IEnumerable<DirectoryInfo> directoryInfos = directoryInfo.EnumerateDirectories("*", SearchOption.TopDirectoryOnly);
            List<Node> directoryNodes = new List<Node>();
            foreach (DirectoryInfo dirInfo in directoryInfos)
            {
                directoryNodes.Add(new Node
                {
                    Path = dirInfo.FullName,
                    Parent = dirInfo.Parent.FullName,
                    Root = dirInfo.Root.FullName,
                    Name = dirInfo.Name,
                    IsFile = false
                });
            }
            return directoryNodes;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="directoryInfo"></param>
        /// <returns></returns>
        private List<Node> CreateFileNodes(DirectoryInfo directoryInfo)
        {
            IEnumerable<FileInfo> filesInfos = directoryInfo.EnumerateFiles("*", SearchOption.TopDirectoryOnly);
            List<Node> fileNodes = new List<Node>();
            foreach (FileInfo fileInfo in filesInfos)
            {
                fileNodes.Add(new Node
                {
                    Path = fileInfo.FullName,
                    Parent = fileInfo.Directory.FullName,
                    Root = fileInfo.Directory.Root.FullName,
                    Name = fileInfo.Name,
                    IsFile = true
                });
            }
            return fileNodes;
        }
    }
}

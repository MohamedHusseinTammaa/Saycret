interface IUserServices{
    getPostsService(limit:number,skip:number):any;
    searchPostsService(limit:number,skip:number):any;
    getPostByIdService(id:string):any;
    createPostService(post:any,isAnonymous:boolean,currentUser:any):any;
    editPartPostService(id:any,post: any):any;
    deletePostService(id:string):any; 
}

import { INote } from "../interfaces/note.interface";
import note from "../models/note.model";

class NoteServices{
    public createNote = async (body: INote, userId: any): Promise<INote> => {
        try{
            body.createdBy = userId;
            const data = await note.create(body);
            return data;

        }catch(err){
            throw new Error("Error occured during creation: "+err);
        }
    }

    public getNoteById = async (id: string) => {
        try{
            return await note.findById({_id: id})
        }catch(error){
            throw new Error("cannot find by id: "+error)
        }
    }

    public updateNote = async (id: string, data: any) => {
        try{
            return note.findByIdAndUpdate({_id: id}, data, {new: true})
        }catch(error){
            throw new Error("cannot find by id and update: "+error)
        }
    }

    public trashNote = async (id: string) => {
        const doc: INote = await note.findOne({_id: id});
        if(doc.isTrash === false){
            return {data: await note.findByIdAndUpdate(id, {isTrash: true}, {new: true}),
                    message: "Note trashed successfully"
                }
        }else{
            return {data: await note.findByIdAndUpdate(id, {isTrash: false}, {new: true}),
                    message: "Note untrashed successfully"
                }
        }
    }

    public deleteNote = async (id: string) => {
        try{
            const doc: INote = await note.findOne({_id: id, isTrash: true})
            if(doc)
                note.findByIdAndDelete({_id: id})
            else
                throw new Error("Nothing in trash with given id")
        }catch(error){
            throw new Error("cannot find by id and delete: "+error)
        }
    }

    // public restoreNote = async (id: string) => {
    //     try{
    //         return note.updateOne({_id: id}, {$set: {isTrash: false}})
    //     }catch(error){
    //         throw new Error("cannot find by id and restore: "+error)
    //     }
    // }

    public viewAll = async (id: string) => {
        try{
            return note.find({createdBy: id})
        }catch(error){
            throw new Error("cannot find: "+error)
        }
    }

    public archiveNote = async (id: string): Promise<any> => {
        const doc: INote = await note.findOne({_id: id});
        if(doc.isArchive === false){
            return {data: await note.findByIdAndUpdate(id, {isArchive: true}, {new: true}),
                    message: "Note archived successfully"
                }
        }else{
            return {data: await note.findByIdAndUpdate(id, {isArchive: false}, {new: true}),
                    message: "Note unarchived successfully"
                }
        }       
    }
}

export default NoteServices;
// import useAxiosPrivate from '@/hooks/useAxiosPrivate'
// import { type Group } from '@/types/Group'
// import { axiosPrivate } from './axios'

// class GroupService {
//   private readonly apiUrl = process.env.API_URL ?? '/groups'

//   async groups (username: string): Promise<Group[]> {
//     try {
//       const response = await useAxiosPrivate.get(
//         'groups',
//         {
//           params: { username },
//           withCredentials: true
//         }
//       )
//       return response.data
//     } catch (error) {
//       return []
//     }
//   }
// }

// const groupService = new GroupService()
// export default groupService

// function getGroups (username: string): Promise<Group[]> {
//   try {
//     const axios = useAxiosPrivate()
//     const response = await axios.get(
//       'groups',
//       {
//         params: { username },
//         withCredentials: true
//       }
//     )
//     return response.data
//   } catch (error) {
//     return []
//   }
// }

// export default getGroups

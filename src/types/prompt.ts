import { Database } from '@/db_types';

export type Prompt = Database['public']['Tables']['prompts']['Row'] | 
                     Database['public']['Tables']['prompts']['Insert'] |
                     Database['public']['Tables']['prompts']['Update']
